import axios from '@/services/axios.customize';
import type {
    IBrandsResponse,
    ICategoriesResponse,
    ICreateProductResponse,
    IGetCategoriesParam,
    IGetProductsParam,
    IProduct,
    IProductDetail,
    IProductSpec,
    IProductVariant,
    ISeriesRes,
} from '@/types/admin/product';

export const getAllProductsAPI = async (params: IGetProductsParam = {}) => {
    const { page = 1, limit = 10, sortBy, sortOrder, category, is_active, search } = params;
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (category) queryParams.append('categoryId', category.join(','));
    if (is_active && is_active.length === 1)
        queryParams.append('is_active', is_active[0] ? 'true' : 'false');
    if (search) queryParams.append('search', search);
    const result = await axios.get<ApiResponse<IPagination<IProduct[]>>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products?${queryParams.toString()}`
    );
    return result.data;
};

export const getAllCategoriesAPI = async (params: IGetCategoriesParam = {}) => {
    const { limit = 20, page = 1 } = params;
    const queryParams = new URLSearchParams();

    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    const result = await axios.get<ApiResponse<ICategoriesResponse>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/categories?${queryParams.toString()}`
    );

    return result.data;
};

export const getBrandsAPI = async () => {
    const result = await axios.get<ApiResponse<IBrandsResponse>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/brands`
    );
    return result.data;
};

export const getSeriesAPI = async () => {
    const result = await axios.get<ApiResponse<ISeriesRes>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/series`
    );
    return result.data;
};

export const deleteProductByID = async (
    id: number | string
): Promise<ApiResponse<{ id: number }>> => {
    const result = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/products/${id}`);
    return result.data;
};
/**
 * Create product with full data: variants, specifications, images
 * Uses FormData for multipart/form-data upload
 */
export const createProductFullAPI = async (data: {
    name: string;
    description: string;
    brand_id: number;
    series_id: number;
    category_id: number;
    is_active: boolean;
    variants: IProductVariant[];
    specifications?: IProductSpec[];
    images?: File[];
}): Promise<ApiResponse<ICreateProductResponse>> => {
    const formData = new FormData();

    // Append basic fields
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('brand_id', data.brand_id.toString());
    formData.append('series_id', data.series_id.toString());
    formData.append('category_id', data.category_id.toString());
    formData.append('is_active', data.is_active.toString());

    // Append variants as JSON string
    formData.append('variants', JSON.stringify(data.variants));

    // Append specifications as JSON string (if exists)
    if (data.specifications && data.specifications.length > 0) {
        formData.append('specifications', JSON.stringify(data.specifications));
    }

    // Append images
    if (data.images && data.images.length > 0) {
        data.images.forEach(file => {
            formData.append('images', file);
        });
    }

    const result = await axios.post<ApiResponse<ICreateProductResponse>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return result.data;
};

/**
 * Update product is_active status (publish/unpublish)
 * @param productId - Product ID (string or number)
 * @param isActive - true = publish to web, false = unpublish
 */
export const updateProductStatusAPI = async (
    productId: string | number,
    isActive: boolean
): Promise<ApiResponse<{ id: number; is_active: boolean }>> => {
    const result = await axios.patch<ApiResponse<{ id: number; is_active: boolean }>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products/${productId}/status`,
        { is_active: isActive }
    );
    return result.data;
};

// ==================== CREATE CATEGORY ====================
export const createCategoryAPI = async (data: {
    name: string;
    parent_id?: number;
}): Promise<ApiResponse<{ id: number; name: string }>> => {
    const result = await axios.post<ApiResponse<{ id: number; name: string }>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/categories`,
        data
    );
    return result.data;
};

// ==================== CREATE BRAND ====================
export const createBrandAPI = async (data: {
    name: string;
    description: string;
    category_id: number;
    image_url?: string;
}): Promise<ApiResponse<{ id: number; name: string }>> => {
    const result = await axios.post<ApiResponse<{ id: number; name: string }>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/brands`,
        data
    );
    return result.data;
};

// ==================== CREATE SERIES ====================
export const createSeriesAPI = async (data: {
    name: string;
    brand_id: number;
}): Promise<ApiResponse<{ id: number; name: string; brand_id: number }>> => {
    const result = await axios.post<ApiResponse<{ id: number; name: string; brand_id: number }>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/series`,
        data
    );
    return result.data;
};

// ==================== GET PRODUCT DETAIL ====================
export const getProductDetailAPI = async (
    productId: string | number
): Promise<ApiResponse<IProductDetail>> => {
    const result = await axios.get<ApiResponse<IProductDetail>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products/${productId}`
    );
    return result.data;
};

// ==================== SEPARATE UPDATE APIs ====================

/**
 * Update product basic info only
 */
export const updateProductInfoAPI = async (
    productId: string | number,
    data: {
        name?: string;
        description?: string;
        brand_id?: number;
        series_id?: number;
        category_id?: number;
        is_active?: boolean;
    }
): Promise<ApiResponse<IProduct>> => {
    const result = await axios.put<ApiResponse<IProduct>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products/${productId}/info`,
        data
    );
    return result.data;
};

/**
 * Update product variants only
 */
export const updateProductVariantsAPI = async (
    productId: string | number,
    data: {
        variants: IProductVariant[];
    }
): Promise<ApiResponse<IProductVariant[]>> => {
    const result = await axios.put<ApiResponse<IProductVariant[]>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products/${productId}/variants`,
        data
    );
    return result.data;
};

/**
 * Update product specifications only
 */
export const updateProductSpecsAPI = async (
    productId: string | number,
    data: {
        specifications: IProductSpec[];
    }
): Promise<ApiResponse<IProductSpec[]>> => {
    const result = await axios.put<ApiResponse<IProductSpec[]>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products/${productId}/specs`,
        data
    );
    return result.data;
};

/**
 * Update product images only
 */
export const updateProductImagesAPI = async (
    productId: string | number,
    data: {
        keepImageIds?: number[];
        thumbnailImageId?: number;
        images?: File[]; // New images to upload
    }
): Promise<ApiResponse<any[]>> => {
    const formData = new FormData();

    // Append keepImageIds as JSON array
    if (data.keepImageIds && data.keepImageIds.length > 0) {
        formData.append('keepImageIds', JSON.stringify(data.keepImageIds));
    } else {
        formData.append('keepImageIds', JSON.stringify([]));
    }

    // Append thumbnailImageId
    if (data.thumbnailImageId) {
        formData.append('thumbnailImageId', data.thumbnailImageId.toString());
    }

    // Append new images
    if (data.images && data.images.length > 0) {
        data.images.forEach(file => {
            formData.append('images', file);
        });
    }

    const result = await axios.put<ApiResponse<any[]>>(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products/${productId}/images`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return result.data;
};
