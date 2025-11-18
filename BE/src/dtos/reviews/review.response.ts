// export interface ReviewResponse {
//     id: number;
//     comment: string;
//     vote: number;
//     user_id: string;
//     product_id: number;
// }
import e from "express";
import z from "zod";

export const ReviewResponseSchema = z.object({
    id: z.number(),
    comment: z.string(),
    vote: z.number(),
    user_id: z.string(),
    product_id: z.number(),
})
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>