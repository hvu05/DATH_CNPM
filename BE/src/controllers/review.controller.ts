import { Request, Response, NextFunction } from "express";

import * as reviewDto from "../dtos/reviews/";
import * as reviewService from "../services/review.service";
import { ApiResponse } from "../types/api-response";

export const createReviewHandler = async(req: Request, res: Response<ApiResponse<reviewDto.ReviewResponse>>, next: NextFunction) => {
    const parsed = reviewDto.ReviewCreateSchema.safeParse(req.body);
    if (!parsed.success){
        return res.status(400).json({
            success: false,
            error: parsed.error.issues[0].message
        });
    }
    console.log(req.params);
    const productId = Number(req.params.product_id);
    console.log(productId);
    if (isNaN(productId)) {
        return res.status(400).json({
            success: false,
            error: "Invalid productId, must be a number"
        })
    }
    const data: reviewDto.ReviewCreateRequest = parsed.data;
    const userId = req.user?.id;
    if (userId === undefined) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }
    try {
        const review = await reviewService.createReview(data, userId, productId);
        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
}

export const getReviewsHandler = async(req: Request, res: Response<ApiResponse<reviewDto.ReviewListResponse>>, next: NextFunction) => {
    const parsed = reviewDto.ReviewListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            error: parsed.error.issues[0].message
        });
    }
    const query: reviewDto.ReviewListQuery = parsed.data;
    const productId = Number(req.params.product_id);
    if (isNaN(productId)) {
        return res.status(400).json({
            success: false,
            error: "Invalid productId, must be a number"
        })
    }
    try {
        const reviews = await reviewService.getAllReviewsOfProduct(productId, query);
        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
}

export const updateReviewHandler = async (req: Request, res: Response<ApiResponse<reviewDto.ReviewResponse>>, next: NextFunction) => {
    const parsed = reviewDto.ReviewCreateSchema.safeParse(req.body);
    if (!parsed.success){
        return res.status(400).json({
            success: false,
            error: parsed.error.issues[0].message
        });
    }
    const data: reviewDto.ReviewCreateRequest = parsed.data;
    const productId = Number(req.params.product_id);
    if (isNaN(productId)) {
        return res.status(400).json({
            success: false,
            error: "Invalid productId, must be a number"
        })
    }
    const reviewId = Number(req.params.review_id);
    if (isNaN(reviewId)) {
        return res.status(400).json({
            success: false,
            error: "Invalid reviewId, must be a number"
        })
    }
    const userId = req.user?.id;
    if (userId === undefined) {
        return res.status(401).json({
            success: false,
            error: "Vui lòng đăng nhập lại"
        });
    }
    try {
        const review = await reviewService.updateReview(data, userId, productId, reviewId);
        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        next(error);
    }
}

export const deleteReviewHandler = async (req: Request, res: Response<ApiResponse<void>>, next: NextFunction) => {
    const productId = Number(req.params.product_id);
    if (isNaN(productId)) {
        return res.status(400).json({
            success: false,
            error: "Invalid productId, must be a number"
        })
    }
    const reviewId = Number(req.params.review_id);
    if (isNaN(reviewId)) {
        return res.status(400).json({
            success: false,
            error: "Invalid reviewId, must be a number"
        })
    }
    const userInfo = req.user;
    if (userInfo === undefined) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }
    try {
        await reviewService.deleteReview(userInfo, productId, reviewId);
        res.json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}
