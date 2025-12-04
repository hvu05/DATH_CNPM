export interface ProductResponse {
  id: number;
  name: string;
  description?: string;
  quantity: number;
  is_active: boolean;
  create_at: Date;
  update_at: Date;
  category?: {
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
  thumbnail?: string;
}

export interface ProductListResponse {
  results: ProductResponse[];
  total: number;
  page: number;
  limit: number;
  filters?: {
    sortBy?: string;
    sortOrder?: string;
    categoryId?: number;
    search?: string;
  };
}

export interface CategoriesResponse {
  id: number;
  name: string;
}

export interface CategoriesListResponse {
  count: number;
  results: CategoriesResponse[];
}

export interface BrandsResponse {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
}

export interface BrandsListResponse {
  count: number;
  results: BrandsResponse[];
}

export interface SeriesRes {
  id: number;
  name: string;
}

export interface SeriesListRes {
  count: number;
  results: SeriesRes[];
}

export interface IAddNewProductResponse {
  id: number;
  name: string;
  description: string;
  quantity: number;
  brand_id: number;
  series_id: number;
  category_id: number;
  is_active: boolean;
  create_at: Date;
  update_at: Date;
}
