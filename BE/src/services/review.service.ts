import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/prisma.config";
import * as reviewDto from "../dtos/reviews";
import { AppError, ErrorCode } from "../exeptions";

export const createReview = async (data: reviewDto.ReviewCreateRequest, userId: string, productId: number): Promise<reviewDto.ReviewResponse> => {
    const order = prisma.order.findFirst({
        where: {
            user_id: userId,
        },
        include: {
            order_items: {
                where: {
                    product_id: productId
                }
            }
        }
    })
    if (!order){
        throw new AppError(ErrorCode.NOT_FOUND, 'Người dùng cần phải mua hàng thì mới đánh giá được sản phẩm này!')
    }
    const lastId = await prisma.review.findFirst({
        where: {
            product_id: productId
        },
        orderBy: { id: "desc" }, 
        select: { id: true } 
    });
    const nextId = (lastId?.id ?? 0) + 1;
    const review = await prisma.review.create({
        data: {
            id: nextId,
            comment: data.comment,
            vote: data.vote,
            user_id: userId,
            product_id: productId,
            parent_id: data.parent_id
        }
    });
    return reviewDto.toReviewResponse(review);
}

export const getAllReviewsOfProduct = async (productId: number, query: reviewDto.ReviewListQuery): Promise<reviewDto.ReviewListResponse> => {
    const { page, limit, sortBy, sortOrder, vote } = query;
    const total = await prisma.review.count({
        where: {
            product_id: productId
        }
    });
    const reviews = await prisma.review.findMany({
        where: {
            product_id: productId,
            vote: vote
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        take: limit,
        skip: (page - 1) * limit
    });
    return reviewDto.toReviewListResponse(reviews, query, total);
}

export const updateReview = async (data: reviewDto.ReviewCreateRequest, userId: string, productId: number, reviewId: number): Promise<reviewDto.ReviewResponse> => {
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId,
            product_id: productId
        }
    });
    if (!review) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Review not found');
    }
    if (review.user_id !== userId) {
        throw new AppError(ErrorCode.FORBIDDEN, 'Bạn không có quyền thực hiện thao tác này!!!');
    }
    const updatedReview = await prisma.review.update({
        where: {
            review_id:{
                product_id: productId,
                id: reviewId
            }
        },
        data: {
            comment: data.comment,
            vote: data.vote
        }
    });
    return reviewDto.toReviewResponse(updatedReview);
}

export const deleteReview = async (userInfo: JwtPayload & {
    id?: string;
    role?: string;
    full_name?: string;
    email?: string;
}, productId: number, reviewId: number): Promise<void> => {
    if (userInfo.role === undefined) {
        throw new AppError(ErrorCode.BAD_REQUEST, 'You do not have permission to perform this action!');
    }
    const review = await prisma.review.findFirst({
        where: {
            id: reviewId,
            product_id: productId
        }
    });
    if (!review) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Review not found');
    }
    if (review.user_id != userInfo.id || userInfo.role !== 'ADMIN') {
        throw new AppError(ErrorCode.FORBIDDEN, 'You do not have permission to perform this action!');
    }
    await prisma.review.delete({
        where: {
            review_id: {
                id: reviewId,
                product_id: productId
            }
        }
    });
}