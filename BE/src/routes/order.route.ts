import * as orderController from '../controllers/order.controller';
import { Router } from 'express';
import { authenticateHandler } from '../middlewares/authenticate.middleware';
import { registry } from '../config/openapi.config';
import * as orderDto from '../dtos/orders';
import { checkRole } from '../middlewares/check-role.middleware';
import { ApiResponseSchema } from '../dtos/common/api-response';
const router = Router();

registry.registerPath({
  tags: ['Order'],
  path: '/orders',
  method: 'post',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ApiResponseSchema(orderDto.OrderCreateSchema)
        }
      }
    }
  },
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(orderDto.OrderResponseSchema)
        }
      }
    }
  }
})
router.post('/', authenticateHandler, orderController.createOrderHandler);

registry.registerPath({
  tags: ['Order'],
  path: '/orders',
  method: 'get',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(orderDto.OrderListResponseSchema)
        }
      }
    }
  }
})
router.get('/', authenticateHandler, checkRole("USER"), orderController.getAllOrderByUser);

export default router;
