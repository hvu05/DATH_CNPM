import { z } from 'zod';

export const uploadImageSchema = z
  .object({
    folder: z.string().optional().default('uploads'),
  })
  .optional();

export const deleteImageSchema = z.object({
  imageUrl: z.url('Invalid image URL'),
});

export type UploadImageRequest = z.infer<typeof uploadImageSchema>;
export type DeleteImageRequest = z.infer<typeof deleteImageSchema>;
