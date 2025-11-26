import z from "zod";

export const ProductUploadImageSchema = z.object({
  is_thumbnail: z.boolean().optional(),
});

export type ProductUploadImageRequest = z.infer<typeof ProductUploadImageSchema>;
