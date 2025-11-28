export {};

declare global {
    // Product Variant interface

    interface IProductVariant {
        color: string;
        storage: string;
        price: number;
        import_price: number;
        quantity: number;
    }

    // Product Specification interface
    interface IProductSpec {
        name: string;
        value: string;
    }

    // Full product create request (for API)
    interface ICreateProductRequest {
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
    interface ICreateProductResponse {
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
    interface IAddProductFormValues {
        name: string;
        description: string;
        category_id: number;
        brand_id: number;
        series_id: number;
        is_active: boolean;
        variants: IProductVariant[];
        specifications?: IProductSpec[];
    }
}
