import * as cartController from '../controllers/cart.controller';
import { Router } from 'express';
import { authenticateHandler } from '../middlewares/authenticate.middleware';
import { registry } from '../config/openapi.config';
import { CartCreateSchema } from '../dtos/cart/cart-create.reques';
import { CartResponseSchema } from '../dtos/cart/cart-list-response';

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
          schema: CartResponseSchema,
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
          schema: CartResponseSchema.array(),
        },
      },
    },
  },
});
router.get('/', authenticateHandler, cartController.getCartHandler);

export default router;
