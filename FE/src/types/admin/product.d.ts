export interface IProduct {
    id: string;
    name: string;
    description: string;
    category: {
        id: number;
        name: string;
    };
    brand?: {
        id: number;
        name: string;
    };
    series?: {
        id: number;
        name: string;
    };
    quantity: number;
    is_active: boolean;
    create_at: Date;
    update_at: Date;
}

export interface IProductStatics {
    totalProducts: number;
    activeProducts: number;
    totalSold: number;
    totalRevenue: number;
}

export interface IProductVariant {
    color: string;
    storage: string;
    price: number;
    import_price: number;
    quantity: number;
}

// Product Specification export interface
export interface IProductSpec {
    name: string;
    value: string;
}

// Full product create request (for API)
export interface ICreateProductRequest {
    name: string;
    description: string;
    brand_id: number;
    series_id: number;
    category_id: number;
    is_active: boolean;
    variants: IProductVariant[];
    specifications?: IProductSpec[];
    images?: File[];
}

// Product create response from API
export interface ICreateProductResponse {
    id: number;
    name: string;
    description: string;
    quantity: number;
    brand_id: number;
    series_id: number;
    category_id: number;
    is_active: boolean;
    create_at: string;
    update_at: string;
}

// Form values for Add Product Modal
export interface IAddProductFormValues {
    name: string;
    description: string;
    category_id: number;
    brand_id: number;
    series_id: number;
    is_active: boolean;
    variants: IProductVariant[];
    specifications?: IProductSpec[];
}

// Use for admin.product.api.ts
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
