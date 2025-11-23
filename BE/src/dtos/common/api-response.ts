import z from "zod";

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  status: z.boolean().default(true),
  message: z.string(),
  data: dataSchema.optional(),
  errors: z.any().optional().nullable(),
});

export type ApiResponse<T> = z.infer<typeof ApiResponseSchema>;