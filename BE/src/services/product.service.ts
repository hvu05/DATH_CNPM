import { prisma } from "../config/prisma.config";
import { AppError } from "../exeptions";
import { ErrorCode } from "../exeptions/error-status";
import { ProductCreateRequest } from "../dtos/product/product-create.request";
import { ProductUpdateRequest } from "../dtos/product/product-update.request";
import { uploadFile } from "../services/cloudinary.service";

export const productService = {
  // ------------------- CREATE PRODUCT -------------------
  async createProduct(data: ProductCreateRequest) {
    // Kiểm tra trùng tên
    const existing = await prisma.product.findFirst({
      where: { name: data.name },
    });
    if (existing) throw new AppError(ErrorCode.CONFLICT, `Product with name "${data.name}" already exists`);

    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        brand_id: data.brand_id,
        series_id: data.series_id,
        category_id: data.category_id,
        is_active: data.is_active ?? true,
      },
    });

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

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: options?.include,
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
    includeThumbnail = false,
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
          product_image: includeThumbnail ? { where: { is_thumbnail: true } } : false,
        },
      }),
      prisma.product.count({ where: filters }),
    ]);

    const formattedProducts = products.map((p) => ({
      ...p,
      thumbnail: p.product_image?.[0]?.image_url || null,
      product_image: undefined, // loại bỏ array thừa
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
    const newImage = await prisma.productImage.create({
      data: {
        id: Date.now(), // tự generate id
        product_id: id,
        image_url: uploaded.url,       // từ uploadFile()
        image_public_id: uploaded.public_id,
        is_thumbnail,
      },
    });

    return newImage;
  },
};
