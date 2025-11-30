import z from 'zod';

export const CartResponseSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  product_variant_id: z.number(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  product_variant: z.object({
    id: z.number(),
    product_id: z.number(),
    thumbnail: z.string().optional(),
    color: z.string().optional(),
    storage: z.string().optional(),
    name: z.string(),
    price: z.number(),
  }),
  thumbnail: z.string(),
});

export type CartResponse = z.infer<typeof CartResponseSchema>;
