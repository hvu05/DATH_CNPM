import { prisma } from '../../config/prisma.config';
import * as adminDto from '../../dtos/admin';
import { AppError, ErrorCode } from '../../exeptions';
import { deleteFile } from '../cloudinary.service';

//Hades - Product management functions for admin

/**
 * Lấy danh sách tất cả products (chỉ admin mới được quyền)
 * @param options các tùy chọn filter và sort
 * @returns danh sách products và tổng số
 */
export const getAllProducts = async (
  options: adminDto.ProductListQueryRequest,
): Promise<adminDto.ProductListResponse> => {
  const {
    page,
    limit,
    sortBy = 'create_at',
    sortOrder = 'desc',
    categoryId,
    search,
    is_active,
  } = options;
  const skip = (page - 1) * limit;

  // Build where clause for filtering
  const where: any = {};

  // Filter by category
  if (categoryId) {
    where.category_id = {
      in: categoryId.split(',').map((item) => Number(item)),
    };
  }

  // Filter by is_active status
  if (is_active !== undefined) {
    where.is_active = is_active;
  }

  // Search by name
  if (search) {
    where.name = {
      contains: search,
    };
  }

  // Build orderBy clause
  const orderBy: any = {};
  orderBy[sortBy] = sortOrder;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where,
      include: {
        category: true,
        brand: true,
        series: true,
        product_image: {
          where: { is_thumbnail: true },
          select: { image_url: true },
          take: 1,
        },
      },
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  const productResponses = products.map((product) => {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      is_active: product.is_active,
      create_at: product.create_at,
      update_at: product.update_at,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : undefined,
      series: {
        id: product.series.id,
        name: product.series.name,
      },
      brand: {
        id: product.brand.id,
        name: product.brand.name,
      },
      thumbnail: product.product_image?.[0]?.image_url || null,
    } as adminDto.ProductResponse;
  });

  return {
    results: productResponses,
    total,
    page,
    limit,
    filters: {
      sortBy,
      sortOrder,
      categoryId,
      search,
    },
  };
};

export const getAllProductsCategories = async (
  options: adminDto.CategoriesQueryRequest,
): Promise<adminDto.CategoriesListResponse> => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  const [categories, count] = await Promise.all([
    prisma.category.findMany({
      skip: skip,
      take: limit,
    }),
    prisma.category.count(),
  ]);
  return {
    count: count,
    results: categories,
  };
};

export const getAllBrands = async (): Promise<adminDto.BrandsListResponse> => {
  const [brands, count] = await Promise.all([
    prisma.brand.findMany(),
    prisma.brand.count(),
  ]);
  return {
    count: count,
    results: brands,
  };
};

export const getAllSeries = async (): Promise<adminDto.SeriesListRes> => {
  const [series, count] = await Promise.all([
    prisma.series.findMany(),
    prisma.series.count(),
  ]);
  return {
    count: count,
    results: series,
  };
};

// ==================== CREATE CATEGORY ====================
export const createCategory = async (data: {
  name: string;
  parent_id?: number;
}) => {
  const existing = await prisma.category.findFirst({
    where: { name: data.name },
  });
  if (existing) {
    throw new Error(`Category "${data.name}" already exists`);
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      parent_id: data.parent_id || null,
    },
  });
  return category;
};

// ==================== CREATE BRAND ====================
export const createBrand = async (data: {
  name: string;
  description: string;
  category_id: number;
  image_url?: string;
}) => {
  const existing = await prisma.brand.findFirst({ where: { name: data.name } });
  if (existing) {
    throw new Error(`Brand "${data.name}" already exists`);
  }

  const brand = await prisma.brand.create({
    data: {
      name: data.name,
      description: data.description,
      category_id: data.category_id,
      image_url: data.image_url || null,
    },
  });
  return brand;
};

// ==================== CREATE SERIES ====================
export const createSeries = async (data: {
  name: string;
  brand_id: number;
}) => {
  const existing = await prisma.series.findFirst({
    where: { name: data.name },
  });
  if (existing) {
    throw new Error(`Series "${data.name}" already exists`);
  }

  // Get next series id for this brand
  const lastSeries = await prisma.series.findFirst({
    where: { brand_id: data.brand_id },
    orderBy: { id: 'desc' },
  });
  const nextId = (lastSeries?.id ?? 0) + 1;

  const series = await prisma.series.create({
    data: {
      id: nextId,
      name: data.name,
      brand_id: data.brand_id,
    },
  });
  return series;
};

export const deleteProduct = async (id: number): Promise<{ id: number }> => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      product_image: true,
      product_specs: true,
      product_variants: {
        include: {
          order_items: true,
        },
      },
      order_items: true,
      reviews: true,
    },
  });

  if (!product) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Product not found');
  }

  const hasOrderItems =
    (product.order_items.length ?? 0) > 0 ||
    product.product_variants.some((v) => (v.order_items.length ?? 0) > 0);

  if (hasOrderItems) {
    throw new AppError(
      ErrorCode.CONFLICT,
      'Không thể xóa sản phẩm vì nó nằm trong đơn hàng của người dùng',
    );
  }

  await Promise.all(
    product.product_image.map((img) =>
      deleteFile(img.image_url).catch(() => undefined),
    ),
  );

  await prisma.$transaction(async (tx) => {
    await tx.review.deleteMany({ where: { product_id: id } });
    await tx.cartItem.deleteMany({ where: { product_id: id } });
    await tx.inventoryLog.deleteMany({ where: { product_id: id } });
    await tx.productSpec.deleteMany({ where: { product_id: id } });
    await tx.productImage.deleteMany({ where: { product_id: id } });
    await tx.productVariant.deleteMany({ where: { product_id: id } });
    await tx.product.delete({ where: { id } });
  });

  return {
    id: product.id,
  };
};
