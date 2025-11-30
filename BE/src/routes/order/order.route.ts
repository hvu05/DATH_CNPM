import * as orderController from '../../controllers/order/order.controller';
import { Router } from 'express';
import { authenticateHandler } from '../../middlewares/authenticate.middleware';
import { registry } from '../../config/openapi.config';
import * as orderDto from '../../dtos/orders';
import { checkRole } from '../../middlewares/check-role.middleware';
import { ApiResponseSchema } from '../../dtos/common/api-response';
import orderStatusRoute from './order-status.route';
import { string } from 'zod';
const router = Router();
router.use('/:order_id', orderStatusRoute);

registry.registerPath({
  tags: ['Order'],
  path: '/orders',
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
          schema: orderDto.OrderCreateSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(
            orderDto.OrderResponseSchema.extend({
              url: string(),
            }),
          ),
        },
      },
    },
  },
});
router.post('/', authenticateHandler, orderController.createOrderHandler);

registry.registerPath({
  tags: ['Order'],
  description: 'Người dùng lấy danh sách order',
  path: '/orders',
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
          schema: ApiResponseSchema(orderDto.OrdersUserListResponseSchema),
        },
      },
    },
  },
});
router.get(
  '/',
  authenticateHandler,
  checkRole('CUSTOMER'),
  orderController.getAllOrderByUser,
);

// registry.registerPath({
//   tags: ['Order'],
//   description: 'Staff xác nhận đơn hàng của người dùng',
//   path: '/orders/{order_id}/confirm',
//   method: 'patch',
//   security: [
//     {
//       bearerAuth: [],
//     },
//   ],
//   parameters: [
//     {
//       name: 'order_id',
//       in: 'path',
//       required: true,
//       schema: { type: 'string' },
//     },
//   ],
//   responses: {
//     '200': {
//       description: 'OK',
//       content: {
//         'application/json': {
//           schema: ApiResponseSchema(orderDto.OrderResponseSchema),
//         },
//       },
//     },
//   },
// });
// router.patch('/:order_id/confirm', authenticateHandler, checkRole(["ADMIN", "STAFF"]), orderController.staffUpdateOrderHandler)

registry.registerPath({
  tags: ['Order'],
  description: 'Admin/Staff lấy danh sách order',
  path: '/orders/all',
  method: 'get',
  security: [
    {
      bearerAuth: [],
    },
  ],
  request: {
    query: orderDto.OrderListQuerySchema,
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(orderDto.OrderListResponseSchema),
        },
      },
    },
  },
});

router.get(
  '/all',
  authenticateHandler,
  checkRole(['ADMIN', 'STAFF']),
  orderController.getAllOrdersHandler,
);
export default router;
