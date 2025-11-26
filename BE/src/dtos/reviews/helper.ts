import { Review } from "@prisma/client";
import { ReviewResponse } from "./review.response";
import { ReviewListResponse} from "./review-list.response";
import { ReviewListQuery } from "./review-list-query.request";

export const toReviewResponse = (review: ReviewNode): ReviewResponse => {
    return { 
        ...review,
        children_reviews: review.children_reviews?.map(toReviewResponse) ?? []
    };
}

export const toReviewListResponse = (reviews: Review[], query: ReviewListQuery, total: number): ReviewListResponse => {
    const tree = buildReviewTree(reviews);
    
    return {
        total: total,
        page: query.page,
        limit: query.limit,
        filters: query,
        reviews: tree.map(toReviewResponse),
    }
}

type ReviewNode = Review & {
  children_reviews?: Review[];
};

const buildReviewTree = (reviews: Review[]) : ReviewNode[] => {
  const map = new Map<number, any>();
  const roots: any[] = [];

  reviews.forEach(r => {
    map.set(r.id, { ...r, children_reviews: [] });
  });

  reviews.forEach(r => {
    const node = map.get(r.id);
    if (r.parent_id) {
      const parent = map.get(r.parent_id);
      if (parent) {
        parent.children_reviews.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
};
