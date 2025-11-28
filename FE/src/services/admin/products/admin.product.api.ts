import type { IProduct } from '@/pages/admin/admin.products';
import axios from '@/services/axios.customize';

export interface IGetProductsParam {
    page?: number;
    limit?: number;
    sortBy?: 'create_at';
    sortOrder?: 'asc' | 'desc';
    category?: string[] | null;
    isActive?: boolean[] | null;
    search?: string;
}

export interface IGetCategoriesParam {
    page?: number;
    limit?: number;
}

export interface ICategoriesResponse {
    count: number;
    results: {
        id: number;
        name: string;
    }[];
}

export interface ISeriesRes {
    count: number;
    results: {
        id: number;
        name: string;
        brand_id: number;
    }[];
}

export interface IBrand {
    id: number;
    name: string;
    description: string;
    image_url: string;
    category_id: number;
}

export interface IBrandsResponse {
    count: number;
    results: IBrand[];
}

export interface ICreateProductReq {
    name: string;
    description: string;
    quantity: number;
    brand_id: number;
    series_id: number;
    category_id: number;
    is_active: boolean;
}

export const getAllProductsAPI = async (params: IGetProductsParam = {}) => {
    const { page = 1, limit = 10, sortBy, sortOrder, category, isActive, search } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (category) queryParams.append('roles', category.join(','));
    if (isActive && isActive.length === 1)
        queryParams.append('isActive', isActive[0] ? 'true' : 'false');
    if (search) queryParams.append('search', search);
    console.log({ queryParams });
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

// Legacy simple product create - deprecated
export const postCreateProduct = async (body: ICreateProductReq) => {
    const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/products`, body);
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
