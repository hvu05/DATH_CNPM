import { z } from "zod";
/*
  * Định nghĩa ImageType và reuse ở các request có upload image
*/

const imageSize : number = Number(process.env.IMAGE_SIZE) || 5;
export const ImageFileSchema = z.object({
  originalname: z.string().min(1, "Missing filename"),
  mimetype: z.enum(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"]),
  size: z.number().max(imageSize * 1024 * 1024, `Max size: ${imageSize} MB`),
  buffer: z.instanceof(Buffer).openapi({
    type: "string",
    format: "binary",
  }),
});

export type ImageFile = z.infer<typeof ImageFileSchema>;