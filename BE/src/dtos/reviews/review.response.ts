// export interface ReviewResponse {
//     id: number;
//     comment: string;
//     vote: number;
//     user_id: string;
//     product_id: number;
// }
import z from 'zod';

const UserShortSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  avatar: z.string().nullable().optional(),
});

export const ReviewResponseSchema: z.ZodType<any> = z
  .lazy(() =>
    z.object({
      id: z.number(),
      comment: z.string(),
      vote: z.number(),
      user_id: z.string(),
      product_id: z.number(),
      create_at: z.date().optional(),
      user: UserShortSchema.optional(),
      children_reviews: z.array(ReviewResponseSchema).optional(),
    }),
  )
  .openapi({
    type: 'object',
    properties: {
      id: { type: 'number' },
      comment: { type: 'string' },
      vote: { type: 'number' },
      user_id: { type: 'string' },
      product_id: { type: 'number' },
      children_reviews: { type: 'array' },
    },
  });
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
