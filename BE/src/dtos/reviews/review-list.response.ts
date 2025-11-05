import { ReviewResponse } from "./review.response";

export interface ReviewListResponse {
  total: number;
  page: number;
  limit: number;
  reviews: ReviewResponse[];
  filters?: {
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    vote?: number
  }; 
}