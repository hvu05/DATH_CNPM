// FE/src/services/MockData.ts

export interface Product {
    id: number | string;
    name: string;
    price: number;
    imageUrl: string;
    category?: string;
    brand?: string;
    description?: string;
    specs?: string[];
    reviews?: {
        id: number | string;
        user: string;
        rating: number;
        comment: string;
        date: string;
        avatar?: string;
    }[];
}

export const products: Product[] = [
    // PHONES
    {
        id: 1,
        name: 'iPhone 17 Pro Max',
        price: 32990000,
        imageUrl: 'https://placehold.co/600x600.png?text=iPhone+17+Pro+Max',
        category: 'phones',
        brand: 'Apple',
        description:
            'iPhone 17 Pro Max với màn hình Super Retina XDR, hệ thống 3 camera 48MP, A-series hiệu năng cao và thời lượng pin cải thiện.',
        specs: [
            'Màn hình: 6.7 inch Super Retina XDR',
            'Chip: A17 Pro',
            'RAM: 8GB',
            'Bộ nhớ: 256GB / 512GB / 1TB',
            'Camera: 48MP + 12MP + 12MP',
            'Pin: 4500mAh',
        ],
        reviews: [
            {
                id: 101,
                user: 'Nguyễn Văn A',
                rating: 5,
                comment: 'Máy mượt, camera xuất sắc.',
                date: '2024-09-01',
            },
        ],
    },
    {
        id: 2,
        name: 'Samsung Galaxy S24 Ultra',
        price: 28990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Samsung+S24+Ultra',
        category: 'phones',
        brand: 'Samsung',
        description: 'Galaxy S24 Ultra – hiệu năng mạnh, camera zoom quang học.',
        specs: ['Màn hình: 6.8 inch AMOLED', 'Chip: Snapdragon 8 Gen 3', 'Pin: 5000mAh'],
        reviews: [
            { id: 201, user: 'Lê C', rating: 5, comment: 'Ảnh chụp quá đã.', date: '2024-08-20' },
        ],
    },
    {
        id: 5,
        name: 'OPPO Reno 11 Pro',
        price: 14990000,
        imageUrl: 'https://placehold.co/600x600.png?text=OPPO+Reno+11+Pro',
        category: 'phones',
        brand: 'OPPO',
        description: 'OPPO Reno 11 Pro cân bằng về thiết kế và camera.',
        specs: ['Màn hình: 6.7 inch', 'RAM: 12GB', 'Pin: 4800mAh'],
    },
    {
        id: 6,
        name: 'Xiaomi 14 Pro',
        price: 17990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Xiaomi+14+Pro',
        category: 'phones',
        brand: 'Xiaomi',
        description: 'Xiaomi 14 Pro - cấu hình mạnh, giá hợp lý.',
        specs: ['Màn hình: 6.73 inch', 'Chip: Snapdragon 8 Gen', 'Pin: 5000mAh'],
    },
    {
        id: 7,
        name: 'HONOR Magic 6 Pro',
        price: 19990000,
        imageUrl: 'https://placehold.co/600x600.png?text=HONOR+Magic+6+Pro',
        category: 'phones',
        brand: 'HONOR',
    },
    {
        id: 8,
        name: 'iPhone 15 Pro',
        price: 26990000,
        imageUrl: 'https://placehold.co/600x600.png?text=iPhone+15+Pro',
        category: 'phones',
        brand: 'Apple',
    },

    // LAPTOPS
    {
        id: 3,
        name: 'Macbook Pro 16"',
        price: 59990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Macbook+Pro+16',
        category: 'laptops',
        brand: 'Apple',
        description: 'MacBook Pro 16" dành cho sáng tạo nội dung.',
        specs: ['Màn hình: 16 inch', 'Chip: M3 Pro', 'RAM: 16GB'],
    },
    {
        id: 10,
        name: 'Macbook Air M2',
        price: 29990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Macbook+Air+M2',
        category: 'laptops',
        brand: 'Apple',
    },
    {
        id: 11,
        name: 'Dell XPS 15',
        price: 45990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Dell+XPS+15',
        category: 'laptops',
        brand: 'Dell',
    },
    {
        id: 12,
        name: 'HP Spectre x360',
        price: 37990000,
        imageUrl: 'https://placehold.co/600x600.png?text=HP+Spectre+x360',
        category: 'laptops',
        brand: 'HP',
    },
    {
        id: 17,
        name: 'Asus ROG Zephyrus',
        price: 52990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Asus+ROG+Zephyrus',
        category: 'laptops',
        brand: 'ASUS',
    },

    // WATCHES
    {
        id: 4,
        name: 'Apple Watch Series 9',
        price: 10990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Apple+Watch+Series+9',
        category: 'watches',
        brand: 'Apple',
    },
    {
        id: 13,
        name: 'Samsung Galaxy Watch 6',
        price: 8990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Galaxy+Watch+6',
        category: 'watches',
        brand: 'Samsung',
    },
    {
        id: 18,
        name: 'Garmin Fenix 7',
        price: 12990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Garmin+Fenix+7',
        category: 'watches',
        brand: 'Garmin',
    },

    // TABLETS
    {
        id: 9,
        name: 'Samsung Galaxy Tab S9',
        price: 16990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Galaxy+Tab+S9',
        category: 'tablets',
        brand: 'Samsung',
    },
    {
        id: 14,
        name: 'iPad Pro 12.9"',
        price: 24990000,
        imageUrl: 'https://placehold.co/600x600.png?text=iPad+Pro+12.9',
        category: 'tablets',
        brand: 'Apple',
    },
    {
        id: 19,
        name: 'Lenovo Tab P12 Pro',
        price: 12990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Lenovo+Tab+P12',
        category: 'tablets',
        brand: 'Lenovo',
    },

    // ACCESSORIES
    {
        id: 15,
        name: 'AirPods Pro 2',
        price: 6990000,
        imageUrl: 'https://placehold.co/600x600.png?text=AirPods+Pro+2',
        category: 'accessories',
        brand: 'Apple',
    },
    {
        id: 16,
        name: 'Sony WH-1000XM5',
        price: 8990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Sony+WH-1000XM5',
        category: 'accessories',
        brand: 'Sony',
    },
    {
        id: 20,
        name: 'Logitech MX Master 3S',
        price: 2790000,
        imageUrl: 'https://placehold.co/600x600.png?text=MX+Master+3S',
        category: 'accessories',
        brand: 'Logitech',
    },
    {
        id: 21,
        name: 'Keychron K2',
        price: 2490000,
        imageUrl: 'https://placehold.co/600x600.png?text=Keychron+K2',
        category: 'accessories',
        brand: 'Keychron',
    },

    // Additional entries to ensure ample data
    {
        id: 22,
        name: 'Nokia G22',
        price: 3490000,
        imageUrl: 'https://placehold.co/600x600.png?text=Nokia+G22',
        category: 'phones',
        brand: 'Nokia',
    },
    {
        id: 23,
        name: 'Realme GT 6',
        price: 8990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Realme+GT+6',
        category: 'phones',
        brand: 'Realme',
    },
    {
        id: 24,
        name: 'Vivo X Fold',
        price: 29990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Vivo+X+Fold',
        category: 'phones',
        brand: 'Vivo',
    },
    {
        id: 25,
        name: 'OnePlus 12',
        price: 18990000,
        imageUrl: 'https://placehold.co/600x600.png?text=OnePlus+12',
        category: 'phones',
        brand: 'OnePlus',
    },
    {
        id: 26,
        name: 'ASUS TUF Gaming A15',
        price: 22990000,
        imageUrl: 'https://placehold.co/600x600.png?text=ASUS+TUF+A15',
        category: 'laptops',
        brand: 'ASUS',
    },
    {
        id: 27,
        name: 'HP Omen 16',
        price: 25990000,
        imageUrl: 'https://placehold.co/600x600.png?text=HP+Omen+16',
        category: 'laptops',
        brand: 'HP',
    },
    {
        id: 28,
        name: 'Dell Inspiron 14',
        price: 14990000,
        imageUrl: 'https://placehold.co/600x600.png?text=Dell+Inspiron+14',
        category: 'laptops',
        brand: 'Dell',
    },
    {
        id: 29,
        name: 'Samsung Galaxy Buds2 Pro',
        price: 3190000,
        imageUrl: 'https://placehold.co/600x600.png?text=Galaxy+Buds2+Pro',
        category: 'accessories',
        brand: 'Samsung',
    },
    {
        id: 30,
        name: 'Anker PowerCore 20000',
        price: 799000,
        imageUrl: 'https://placehold.co/600x600.png?text=Anker+PowerCore+20000',
        category: 'accessories',
        brand: 'Anker',
    },
];
