import { Review } from "@prisma/client";
import { ReviewResponse } from "./review.response";
import { ReviewListResponse} from "./review-list.response";
import { ReviewListQuery } from "./review-list-query.request";

export const toReviewResponse = (review: Review): ReviewResponse => {
    return { ...review };
}

export const toReviewListResponse = (reviews: Review[], query: ReviewListQuery, total: number): ReviewListResponse => {
    return {
        total: total,
        page: query.page,
        limit: query.limit,
        filters: query,
        reviews: reviews.map(toReviewResponse),
    }
}