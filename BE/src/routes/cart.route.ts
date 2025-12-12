import * as cartController from '../controllers/cart.controller';
import { Router } from 'express';
import { authenticateHandler } from '../middlewares/authenticate.middleware';
import { registry } from '../config/openapi.config';
import { CartCreateSchema } from '../dtos/cart/cart-create.reques';
import { CartResponseSchema } from '../dtos/cart/cart-list-response';
import { ApiResponseSchema } from '../dtos/common/api-response';

const router = Router();

registry.registerPath({
  tags: ['Cart'],
  path: '/carts',
  method: 'post',
  security: [
    {
      bearerAuth: [],
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CartCreateSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(CartResponseSchema.array()),
        },
      },
    },
  },
});
router.post('/', authenticateHandler, cartController.createCartHandler);

registry.registerPath({
  tags: ['Cart'],
  path: '/carts',
  method: 'get',
  security: [
    {
      bearerAuth: [],
    },
  ],
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(CartResponseSchema.array()),
        },
      },
    },
  },
});
router.get('/', authenticateHandler, cartController.getCartHandler);

registry.registerPath({
  tags: ['Cart'],
  path: '/carts',
  method: 'put',
  security: [
    {
      bearerAuth: [],
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CartCreateSchema, // Tái sử dụng schema
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Cập nhật OK',
      content: {
        'application/json': {
          schema: CartResponseSchema,
        },
      },
    },
  },
});
router.put('/', authenticateHandler, cartController.updateCartHandler);

registry.registerPath({
  tags: ['Cart'],
  path: '/carts/{variantId}',
  method: 'delete',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'variantId',
      in: 'path',
      required: true,
      schema: {
        type: 'number',
      },
      description: 'ID của Product Variant cần xóa khỏi giỏ hàng',
    },
  ],
  responses: {
    '200': {
      description: 'Xóa OK',
      content: {
        'application/json': {
          schema: CartResponseSchema.array(), // Trả về giỏ hàng mới
        },
      },
    },
  },
});
router.delete('/:variantId', authenticateHandler, cartController.deleteCartHandler);

export default router;
