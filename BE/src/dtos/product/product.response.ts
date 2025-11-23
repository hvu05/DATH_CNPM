import { z } from "zod";

/* =============================
   CATEGORY RESPONSE
============================= */
export const CategoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  create_at: z.date(),
  parent_id: z.number().nullable(),

  // relation
  // brands → không đưa vào để tránh vòng lặp
  // products → không đưa vào
  // parent, children → chỉ dùng khi cần
});

export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;

/* =============================
   BRAND RESPONSE
============================= */
export const BrandResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: z.string().nullable(),
  category_id: z.number(),

  category: CategoryResponseSchema.optional(),
});

export type BrandResponse = z.infer<typeof BrandResponseSchema>;

/* =============================
   PRODUCT IMAGE RESPONSE
============================= */
export const ProductImageResponseSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  image_url: z.string(),
  image_public_id: z.string(),
  is_thumbnail: z.boolean(),
});

export type ProductImageResponse = z.infer<typeof ProductImageResponseSchema>;

/* =============================
   PRODUCT SPEC RESPONSE
============================= */
export const ProductSpecResponseSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  spec_name: z.string(),
  spec_value: z.string(),
});

export type ProductSpecResponse = z.infer<typeof ProductSpecResponseSchema>;

/* =============================
   PRODUCT VARIANT RESPONSE
============================= */
export const ProductVariantResponseSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  color: z.string().nullable(),
  storage: z.string().nullable(),
  import_price: z.number(),
  price: z.number(),
  quantity: z.number(),
  create_at: z.date(),
});

export type ProductVariantResponse = z.infer<typeof ProductVariantResponseSchema>;

/* =============================
   PRODUCT RESPONSE
============================= */
export const ProductResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  quantity: z.number(),

  brand_id: z.number(),
  category_id: z.number(),
  series_id: z.number(),

  is_active: z.boolean(),
  create_at: z.date(),
  update_at: z.date(),

  // Relations
  brand: BrandResponseSchema.optional(),
  category: CategoryResponseSchema.optional(),

  product_image: ProductImageResponseSchema.array().optional(),
  product_specs: ProductSpecResponseSchema.array().optional(),
  product_variants: ProductVariantResponseSchema.array().optional(),
  reviews: z.any().array().optional(), // nếu muốn, tôi viết review.response luôn
});

export type ProductResponse = z.infer<typeof ProductResponseSchema>;