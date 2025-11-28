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
    thumbnail?: string | null;
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

// Full product detail for editing
export interface IProductImage {
    id: number;
    product_id: number;
    image_url: string;
    image_public_id: string;
    is_thumbnail: boolean;
}

export interface IProductVariantDetail {
    id: number;
    product_id: number;
    color: string | null;
    storage: string | null;
    import_price: number;
    price: number;
    quantity: number;
    create_at: string;
}

export interface IProductSpecDetail {
    id: number;
    product_id: number;
    spec_name: string;
    spec_value: string;
}

export interface IProductDetail {
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
    brand: {
        id: number;
        name: string;
        description: string;
        image_url: string;
        category_id: number;
    };
    series: {
        id: number;
        name: string;
        brand_id: number;
    };
    category: {
        id: number;
        name: string;
        parent_id: number | null;
    };
    product_image: IProductImage[];
    product_variants: IProductVariantDetail[];
    product_specs: IProductSpecDetail[];
    reviews: any[];
}
