import { prisma } from '../config/prisma.config';
import { AppError } from '../exeptions';
import { ErrorCode } from '../exeptions/error-status';
import { ProductCreateRequest } from '../dtos/product/product-create.request';
import { ProductUpdateRequest } from '../dtos/product/product-update.request';
import { uploadFile, deleteFile } from '../services/cloudinary.service';
import { ProductSpecCreate } from '../dtos/product/specification/product-spec-create.request';
import { ProductVariantCreate } from '../dtos/product/variant/product-variant-create.request';
import { InventoryType } from '../dtos/inventory/enum';

// Type for full product update request
export interface ProductFullUpdateRequest {
  name?: string;
  description?: string;
  brand_id?: number;
  series_id?: number;
  category_id?: number;
  is_active?: boolean;
  // Keep existing images by their IDs (composite: id + product_id)
  keepImageIds?: number[];
  // New images to upload
  images?: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
    is_thumbnail?: boolean;
  }[];
  // Thumbnail image id (from existing images)
  thumbnailImageId?: number;
  // Variants - will replace all existing variants
  variants?: ProductVariantCreate[];
  // Specifications - will replace all existing specs
  specifications?: ProductSpecCreate[];
}

export const productService = {
  // ------------------- CREATE PRODUCT -------------------
  async createProduct(data: ProductCreateRequest) {
    // Kiểm tra trùng tên
    const existing = await prisma.product.findFirst({
      where: { name: data.name },
    });
    if (existing)
      throw new AppError(
        ErrorCode.CONFLICT,
        `Product with name "${data.name}" already exists`,
      );

    let imageUrl: any[] = [];
    if (data.images) {
      if (!data.images.some((image) => image.is_thumbnail === true)) {
        if (data.images.length > 0) {
          data.images[0].is_thumbnail = true;
        }
      }
      imageUrl = await Promise.all(
        data.images.map(async (image, index) => {
          const { url, public_id } = await uploadFile(
            image.buffer,
            `${image.originalname}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            'products',
          );
          return {
            id: index + 1,
            image_url: url,
            image_public_id: public_id,
            is_thumbnail: image.is_thumbnail,
          };
        }),
      );
    }
    const productSpecBlock = toProductSpecBlock(data.specifications);
    const productVariantBlock = toProductVariantBlock(data.variants);

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        brand_id: data.brand_id,
        series_id: data.series_id,
        category_id: data.category_id,
        is_active: data.is_active ?? true,
        ...productSpecBlock,
        product_image: {
          createMany: {
            data: imageUrl,
          },
        },
        ...productVariantBlock,
      },
      include: {
        product_variants: true,
        product_image: {
          where: {
            is_thumbnail: true,
          },
          select: {
            image_url: true,
            is_thumbnail: true,
          },
        },
      },
    });
    if (!data.variants) return newProduct;
    const inventoryData = newProduct.product_variants.map((v, idx) => ({
      product_id: newProduct.id,
      product_variant_id: v.id,
      type: InventoryType.IN,
      quantity: v.quantity,
      reason: 'Log nhập kho lúc tạo sản phẩm',
    }));
    await prisma.inventoryLog.createMany({
      data: inventoryData,
    });
    return newProduct;
  },

  // ------------------- UPDATE PRODUCT -------------------
  async updateProduct(id: number | string, data: ProductUpdateRequest) {
    const productId = typeof id === 'string' ? parseInt(id) : id;
    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found');

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
      },
    });

    return updated;
  },

  // ------------------- UPDATE PRODUCT FULL -------------------
  async updateProductFull(id: number | string, data: ProductFullUpdateRequest) {
    const productId = typeof id === 'string' ? parseInt(id) : id;

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        product_image: true,
        product_variants: true,
        product_specs: true,
      },
    });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found');

    // Check name conflict (if name is being updated)
    if (data.name && data.name !== existing.name) {
      const nameConflict = await prisma.product.findFirst({
        where: { name: data.name, id: { not: productId } },
      });
      if (nameConflict) {
        throw new AppError(
          ErrorCode.CONFLICT,
          `Product with name "${data.name}" already exists`,
        );
      }
    }

    // === HANDLE IMAGES ===
    const keepImageIds = data.keepImageIds || [];
    const imagesToDelete = existing.product_image.filter(
      (img) => !keepImageIds.includes(img.id),
    );

    // Delete removed images from Cloudinary
    for (const img of imagesToDelete) {
      try {
        await deleteFile(img.image_url);
      } catch (error) {
        console.warn(
          `Failed to delete image from Cloudinary: ${img.image_url}`,
        );
      }
    }

    // Delete removed images from DB
    if (imagesToDelete.length > 0) {
      await prisma.productImage.deleteMany({
        where: {
          product_id: productId,
          id: { in: imagesToDelete.map((img) => img.id) },
        },
      });
    }

    // Reset all thumbnails first
    await prisma.productImage.updateMany({
      where: { product_id: productId },
      data: { is_thumbnail: false },
    });

    // Set new thumbnail if specified from existing images
    if (data.thumbnailImageId && keepImageIds.includes(data.thumbnailImageId)) {
      await prisma.productImage.update({
        where: {
          image_id: { id: data.thumbnailImageId, product_id: productId },
        },
        data: { is_thumbnail: true },
      });
    }

    // Upload new images
    let newImageUrl: any[] = [];
    if (data.images && data.images.length > 0) {
      // Get the max image ID for this product
      const maxImageId = await prisma.productImage.findFirst({
        where: { product_id: productId },
        orderBy: { id: 'desc' },
        select: { id: true },
      });
      let nextId = (maxImageId?.id ?? 0) + 1;

      // Check if we need a new thumbnail (no existing thumbnail set)
      const hasExistingThumbnail =
        data.thumbnailImageId && keepImageIds.includes(data.thumbnailImageId);

      newImageUrl = await Promise.all(
        data.images.map(async (image, index) => {
          const { url, public_id } = await uploadFile(
            image.buffer,
            `${image.originalname}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            'products',
          );
          const imageId = nextId + index;
          return {
            id: imageId,
            image_url: url,
            image_public_id: public_id,
            // First new image is thumbnail if no existing thumbnail
            is_thumbnail: !hasExistingThumbnail && index === 0,
          };
        }),
      );

      // Create new images
      await prisma.productImage.createMany({
        data: newImageUrl.map((img) => ({
          ...img,
          product_id: productId,
        })),
      });
    }

    // === HANDLE VARIANTS ===
    if (data.variants && data.variants.length > 0) {
      // Delete all existing variants
      await prisma.productVariant.deleteMany({
        where: { product_id: productId },
      });

      // Create new variants
      const variantData = data.variants.map((v, idx) => ({
        id: idx + 1,
        product_id: productId,
        color: v.color,
        storage: v.storage,
        price: v.price,
        quantity: v.quantity,
        import_price: v.import_price,
      }));

      await prisma.productVariant.createMany({
        data: variantData,
      });

      // Create inventory logs for new variants
      const inventoryData = variantData.map((v) => ({
        product_id: productId,
        product_variant_id: v.id,
        type: InventoryType.IN,
        quantity: v.quantity,
        reason: 'Log nhập kho khi cập nhật sản phẩm',
      }));
      await prisma.inventoryLog.createMany({
        data: inventoryData,
      });
    }

    // === HANDLE SPECIFICATIONS ===
    if (data.specifications !== undefined) {
      // Delete all existing specs
      await prisma.productSpec.deleteMany({
        where: { product_id: productId },
      });

      // Create new specs if any
      if (data.specifications.length > 0) {
        const specData = data.specifications.map((spec, idx) => ({
          id: idx + 1,
          product_id: productId,
          spec_name: spec.name,
          spec_value: spec.value,
        }));

        await prisma.productSpec.createMany({
          data: specData,
        });
      }
    }

    // Calculate total quantity from variants
    const totalQuantity = data.variants
      ? data.variants.reduce((sum, v) => sum + v.quantity, 0)
      : existing.quantity;

    // === UPDATE PRODUCT BASIC INFO ===
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        brand_id: data.brand_id ?? existing.brand_id,
        series_id: data.series_id ?? existing.series_id,
        category_id: data.category_id ?? existing.category_id,
        is_active: data.is_active ?? existing.is_active,
        quantity: totalQuantity,
      },
      include: {
        brand: true,
        series: true,
        category: true,
        product_image: true,
        product_variants: true,
        product_specs: true,
      },
    });

    return updatedProduct;
  },

  // ------------------- DELETE PRODUCT -------------------
  async deleteProduct(id: number | string) {
    const productId = typeof id === 'string' ? parseInt(id) : id;
    const existing = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found');

    await prisma.product.delete({ where: { id: productId } });

    return;
  },

  // ------------------- GET SINGLE PRODUCT -------------------
  async getProductById(id: number | string, options?: { include?: any }) {
    const productId = typeof id === 'string' ? parseInt(id) : id;

    const product = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        brand: true,
        series: true,
        category: true,
        product_image: true,
        product_variants: true,
        product_specs: true,
        reviews: true,
      },
    });

    return product;
  },

  // ------------------- GET ALL PRODUCTS -------------------
  async getAllProducts({
    filters,
    offset = 0,
    limit,
    sortBy = 'create_at',
    order = 'asc',
    includeThumbnail = true,
  }: {
    filters?: any;
    offset?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
    includeThumbnail?: boolean;
  }) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: order },
        include: {
          brand: true,
          series: true,
          category: true,
          product_image: includeThumbnail
            ? {
                where: { is_thumbnail: true },
                select: { image_url: true, is_thumbnail: true },
              }
            : false,
          reviews: true,
        },
      }),
      prisma.product.count({ where: filters }),
    ]);

    const formattedProducts = products.map((p) => ({
      ...p,
      rate: {
        avg:
          p.reviews.reduce((acc, cur) => acc + cur.vote, 0) /
          (p.reviews.length || 1),
        count: p.reviews.length,
      },
    }));

    return { products: formattedProducts, total };
  },

  // ------------------- UPLOAD PRODUCT IMAGE -------------------
  async uploadProductImage(
    productId: number | string,
    file: Express.Multer.File,
    is_thumbnail: boolean,
  ) {
    const id = typeof productId === 'string' ? parseInt(productId) : productId;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, 'Product not found');

    if (is_thumbnail) {
      // Reset thumbnail cũ
      await prisma.productImage.updateMany({
        where: { product_id: id, is_thumbnail: true },
        data: { is_thumbnail: false },
      });
    }

    const publicId = `products/product_${id}_${Date.now()}`;
    const uploaded = await uploadFile(file.buffer, publicId, 'products');
    const lastId = await prisma.productImage.findFirst({
      where: {
        product_id: productId as number,
      },
      orderBy: { id: 'desc' },
      select: { id: true },
    });
    const nextId = (lastId?.id ?? 0) + 1;
    const newImage = await prisma.productImage.create({
      data: {
        id: nextId,
        product_id: id,
        image_url: uploaded.url,
        image_public_id: uploaded.public_id,
        is_thumbnail,
      },
    });

    return newImage;
  },
};

const toProductSpecBlock = (
  specs: ProductSpecCreate[] | undefined,
  lastId: number = 0,
) => {
  if (!Array.isArray(specs) || specs.length === 0) return {};
  return {
    product_specs: {
      createMany: {
        data: specs.map((spec, index) => ({
          id: lastId + index + 1,
          spec_name: spec.name,
          spec_value: spec.value,
        })),
      },
    },
  };
};

const toProductVariantBlock = (
  variants: ProductVariantCreate[] | undefined,
  lastId: number = 0,
) => {
  if (!Array.isArray(variants) || variants.length === 0) return {};

  // createMany variant
  const variantData = variants.map((v, idx) => ({
    id: lastId + idx + 1, // bạn tự sinh id
    color: v.color,
    storage: v.storage,
    price: v.price,
    quantity: v.quantity,
    import_price: v.import_price,
  }));

  return {
    product_variants: {
      createMany: {
        data: variantData,
      },
    },
  };
};

// ------------------- UPDATE PRODUCT STATUS -------------------
export const updateProductStatus = async (
  productId: number,
  isActive: boolean,
) => {
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: { is_active: isActive },
  });
  return updatedProduct;
};
