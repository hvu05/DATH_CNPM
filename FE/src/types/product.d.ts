// FE/src/types/product.d.ts

export interface BackendVariant {
    id: number;
    product_id: number;
    color: string;
    storage: string;
    price: number | string; 
    quantity: number;
    import_price?: number;
}

export interface BackendImage {
    id?: number;
    product_id?: number;
    image_url: string;
    is_thumbnail?: boolean;
}


export interface Product {
    id: number;
    name: string;
    price: number;       
    imageUrl: string;    
    description: string;
    brand: string;
    category: string;
    rating: number;
    quantity: number;    
    
    originalVariants: BackendVariant[];
    originalImages: BackendImage[];
}