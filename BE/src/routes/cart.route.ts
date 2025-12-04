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
  path: '/carts/{id}',
  method: 'patch',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CartCreateSchema.pick({ quantity: true }),
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
router.patch('/:id', authenticateHandler, cartController.updateCartHandler);

registry.registerPath({
  tags: ['Cart'],
  path: '/carts/{id}',
  method: 'delete',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
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
router.delete('/:id', authenticateHandler, cartController.deleteCartHandler);
export default router;
