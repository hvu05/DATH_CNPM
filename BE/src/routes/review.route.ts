import { Router } from "express";

import * as reviewController from "../controllers/review.controller";
import { authenticateHandler } from "../middlewares/authenticate.middleware";
import { registry } from "../config/openapi.config";
import * as reviewDto from '../dtos/reviews'
import { ApiResponseSchema } from "../dtos/common/api-response";
const router = Router({
  mergeParams: true
});

registry.registerPath({
  tags: ['Review'],
  path: 'products/{product_id}/reviews',
  method: 'post',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  parameters: [
    {
      name: "product_id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: reviewDto.ReviewCreateSchema
        }
      }
    }
  },
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(reviewDto.ReviewResponseSchema)
        }
      }
    }
  }
})
router.post("/",authenticateHandler, reviewController.createReviewHandler);


registry.registerPath({
  tags: ['Review'],
  path: 'products/{product_id}/reviews',
  method: 'get',
  parameters: [
    {
      name: "product_id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(reviewDto.ReviewListResponseSchema)
        }
      }
    }
  }
})
router.get("/", reviewController.getReviewsHandler);


registry.registerPath({
  tags: ['Review'],
  path: 'products/{product_id}/reviews/{review_id}',
  method: 'put',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  parameters: [
    {
      name: "product_id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
    {
      name: "review_id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: reviewDto.ReviewCreateSchema
        }
      }
    }
  },
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(reviewDto.ReviewResponseSchema)
        }
      }
    }
  }
})
router.put("/:review_id",authenticateHandler, reviewController.updateReviewHandler);

registry.registerPath({
  tags: ['Review'],
  path: 'products/{product_id}/reviews/{review_id}',
  method: 'delete',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  parameters: [
    {
      name: "product_id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
    {
      name: "review_id",
      in: "path",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean"
              },
              message: {
                type: "string",
                default: "Review deleted successfully"
              }
            }
          }
        }
      }
    }
  }
})
router.delete("/:review_id",authenticateHandler, reviewController.deleteReviewHandler);
export default router