import { prisma } from '../../config/prisma.config';
import * as adminDto from '../../dtos/admin';

//Hades - Product management functions for admin

/**
 * Lấy danh sách tất cả products (chỉ admin mới được quyền)
 * @param options các tùy chọn filter và sort
 * @returns danh sách products và tổng số
 */
export const getAllProducts = async (options: adminDto.ProductListQueryRequest): Promise<adminDto.ProductListResponse> => {
    const { page, limit, sortBy = 'create_at', sortOrder = 'desc', categoryId, search } = options;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    // Filter by category
    if (categoryId) {
        where.category_id = categoryId;
    }

    // Search by name
    if (search) {
        where.name = {
            contains: search
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
            },
            orderBy
        }),
        prisma.product.count({ where })
    ]);

    const productResponses = products.map(product => {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            quantity: product.quantity,
            is_active: product.is_active,
            create_at: product.create_at,
            update_at: product.update_at,
            category: product.category ? {
                id: product.category.id,
                name: product.category.name
            } : undefined,
            series: {
                id: product.series.id,
                name: product.series.name
            },
            brand: {
                id: product.brand.id,
                name: product.brand.name
            },
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
            search
        }
    };
};

export const getAllProductsCategories = async (options: adminDto.CategoriesQueryRequest): Promise<adminDto.CategoriesListResponse> => {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [categories, count] = await Promise.all([
        prisma.category.findMany({
            skip: skip,
            take: limit,
        }),
        prisma.category.count()
    ])
    return {
        count: count,
        results: categories
    }
}

export const getAllBrands = async (): Promise<adminDto.BrandsListResponse> => {
    const [brands, count] = await Promise.all([
        prisma.brand.findMany(),
        prisma.brand.count()
    ])
    return {
        count: count,
        results: brands
    }
}

export const getAllSeries = async (): Promise<adminDto.SeriesListRes> => {
    const [series, count] = await Promise.all([
        prisma.series.findMany(),
        prisma.series.count()
    ]);
    return {
        count: count,
        results: series
    }
}

export const addNewProduct = async (data: adminDto.NewProductBody): Promise<adminDto.IAddNewProductResponse> => {
    const newProduct = await prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            quantity: data.quantity,
            brand_id: data.brand_id,
            series_id: data.series_id,
            category_id: data.category_id,
            is_active: data.is_active,
        }
    })
    return newProduct;
}