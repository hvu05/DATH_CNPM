import z from 'zod';
import { ProductVariantCreateSchema } from './variant/product-variant-create.request';
import { ProductSpecCreateSchema } from './specification/product-spec-create.request';
import { ProductUploadImageSchema } from './product-upload-image.request';
import { zCoerceArray, zCoerceObject } from '../../config/zod-open-api.config';

export const ProductCreateSchema = z.object({
  name: z.string().nonempty('Product name is required'),
  description: z.string().nonempty('Product description is required'),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative('Quantity must be non-negative')
    .default(0),
  brand_id: z.coerce.number().int().positive('Brand ID is required'),
  series_id: z.coerce.number().int().positive('Series ID is required'),
  category_id: z.coerce.number().int().positive('Category ID is required'),
  is_active: z.coerce.boolean().optional(),
  // Bổ sung
  images: z.array(ProductUploadImageSchema).min(0).max(10).optional(),
  variants: zCoerceArray(ProductVariantCreateSchema).optional(),
  specifications: zCoerceArray(ProductSpecCreateSchema).optional(),
});

export type ProductCreateRequest = z.infer<typeof ProductCreateSchema>;
