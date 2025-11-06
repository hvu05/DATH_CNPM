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