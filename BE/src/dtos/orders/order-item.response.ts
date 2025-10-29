import z from "zod";

export interface ProductVariant {
  id: number ,
  product_id : number
  color?: string;
  storage?: string;
  name : string
}

export interface OrderItemResponse {
  id: string;
  price_per_item: number;
  quantity: number;
  product_variant: ProductVariant;
}

