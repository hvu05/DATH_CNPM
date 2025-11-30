import z from 'zod';

export const CartCreateSchema = z.object({
  product_id: z.number(),
  product_variant_id: z.number(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
});

export type CartCreateRequest = z.infer<typeof CartCreateSchema>;
