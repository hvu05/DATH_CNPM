import { ReviewListQuerySchema } from "./review-list-query.request";
import { ReviewResponse, ReviewResponseSchema } from "./review.response";

// export interface ReviewListResponse {
//   total: number;
//   page: number;
//   limit: number;
//   reviews: ReviewResponse[];
//   filters?: {
//     sortBy?: string;
//     sortOrder?: string;
//     search?: string;
//     vote?: number
//   }; 
// }
import z from "zod";

export const ReviewListResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  reviews: z.array(ReviewResponseSchema),
  filters: ReviewListQuerySchema.optional()
})

export type ReviewListResponse = z.infer<typeof ReviewListResponseSchema>