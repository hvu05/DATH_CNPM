import { prisma } from "../config/prisma.config";
import { AppError } from "../exeptions";
import { ErrorCode } from "../exeptions/error-status";
import { ProductCreateRequest } from "../dtos/product/product-create.request";
import { ProductUpdateRequest } from "../dtos/product/product-update.request";
import { uploadFile } from "../services/cloudinary.service";
import { ProductSpecCreate } from "../dtos/product/specification/product-spec-create.request";
import { ProductVariantCreate } from "../dtos/product/variant/product-variant-create.request";
import { InventoryType } from "../dtos/inventory/enum";
import { da } from "zod/v4/locales";

export const productService = {
  // ------------------- CREATE PRODUCT -------------------
  async createProduct(data: ProductCreateRequest) {
    // Kiểm tra trùng tên
    const existing = await prisma.product.findFirst({
      where: { name: data.name },
    });
    if (existing) throw new AppError(ErrorCode.CONFLICT, `Product with name "${data.name}" already exists`);
    
    let imageUrl : any[] = [];
    if (data.images) {
      if (!data.images.some((image) => image.is_thumbnail === true)) {
        if (data.images.length > 0) {
          data.images[0].is_thumbnail = true
        }
      }
      imageUrl = await Promise.all(data.images.map(async (image, index) => {
        const { url, public_id } = await uploadFile(image.buffer, `${image.originalname}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, "products");
        return { 
          id: index + 1, 
          image_url: url,
          image_public_id: public_id,
          is_thumbnail: image.is_thumbnail
        };
      }))
    }
    const productSpecBlock = toProductSpecBlock(data.specifications);
    const productVariantBlock = toProductVariantBlock(data.variants);

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        brand_id: data.brand_id,
        series_id: data.series_id ,
        category_id: data.category_id,
        is_active: data.is_active ?? true,
        ...productSpecBlock,
        product_image: {
          createMany: {
            data: imageUrl
          }
        },
        ...productVariantBlock
      },
      include: {
        product_variants: true,
        product_image: {
          where: {
            is_thumbnail: true
          },
          select: {
            image_url: true,
            is_thumbnail: true
          }
        }
      }
    });
    if (!data.variants) return newProduct;
    const inventoryData = newProduct.product_variants.map((v, idx) => ({
      product_id: newProduct.id,
      product_variant_id: v.id,
      type: InventoryType.IN,
      quantity: v.quantity,
      reason: "Log nhập kho lúc tạo sản phẩm",
    }));
    await prisma.inventoryLog.createMany({
      data: inventoryData
    })
    return newProduct;
  },

  // ------------------- UPDATE PRODUCT -------------------
  async updateProduct(id: number | string, data: ProductUpdateRequest) {
    const productId = typeof id === "string" ? parseInt(id) : id;
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, "Product not found");

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...data,
      },
    });

    return updated;
  },

  // ------------------- DELETE PRODUCT -------------------
  async deleteProduct(id: number | string) {
    const productId = typeof id === "string" ? parseInt(id) : id;
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, "Product not found");

    await prisma.product.delete({ where: { id: productId } });

    return;
  },

  // ------------------- GET SINGLE PRODUCT -------------------
  async getProductById(
    id: number | string,
    options?: { include?: any }
  ) {
    const productId = typeof id === "string" ? parseInt(id) : id;

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
    sortBy = "create_at",
    order = "asc",
    includeThumbnail = true,
  }: {
    filters?: any;
    offset?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
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
          product_image: includeThumbnail ? { where: { is_thumbnail: true }, select: { image_url: true, is_thumbnail: true} } : false,
          reviews: true
        },
      }),
      prisma.product.count({ where: filters }),
    ]);

    const formattedProducts = products.map((p) => ({
      ...p,
      rate: {
        avg: p.reviews.reduce((acc, cur) => acc + cur.vote, 0) / (p.reviews.length || 1),
        count: p.reviews.length
      }
    }));

    return { products: formattedProducts, total };
  },

  // ------------------- UPLOAD PRODUCT IMAGE -------------------
  async uploadProductImage(
    productId: number | string,
    file: Express.Multer.File,
    is_thumbnail: boolean
  ) {
    const id = typeof productId === "string" ? parseInt(productId) : productId;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new AppError(ErrorCode.NOT_FOUND, "Product not found");

    if (is_thumbnail) {
      // Reset thumbnail cũ
      await prisma.productImage.updateMany({
        where: { product_id: id, is_thumbnail: true },
        data: { is_thumbnail: false },
      });
    }

    const publicId = `products/product_${id}_${Date.now()}`;
    const uploaded = await uploadFile(file.buffer, publicId, "products");
    const lastId = await prisma.productImage.findFirst({
        where: {
            product_id: productId as number
        },
        orderBy: { id: "desc" }, 
        select: { id: true } 
    });
    const nextId = (lastId?.id ?? 0) + 1;
    const newImage = await prisma.productImage.create({
      data: {
        id:nextId,
        product_id: id,
        image_url: uploaded.url,
        image_public_id: uploaded.public_id,
        is_thumbnail,
      },
    });

    return newImage;
  },
};

const toProductSpecBlock = (specs: ProductSpecCreate[] | undefined, lastId: number = 0) => {
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
  lastId: number = 0
) => {
  if (!Array.isArray(variants) || variants.length === 0) return {};

  // createMany variant
  const variantData = variants.map((v, idx) => ({
    id: lastId + idx + 1,        // bạn tự sinh id
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
    }
  };
};
