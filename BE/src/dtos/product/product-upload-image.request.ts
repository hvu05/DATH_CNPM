import z from 'zod';
import { ImageFileSchema } from '../upload/image';

export const ProductUploadImageSchema = ImageFileSchema.extend({
  is_thumbnail: z.coerce.boolean().default(false),
});

export type ProductUploadImageRequest = z.infer<
  typeof ProductUploadImageSchema
>;
