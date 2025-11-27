import { Router } from 'express';
import * as orderActionController from '../../controllers/order/order-action.controller';
import * as orderReturnController from '../../controllers/order/order-return.controller';
import * as orderDto from '../../dtos/orders';
import { authenticateHandler } from '../../middlewares/authenticate.middleware';
import { registry } from '../../config/openapi.config';
import { ApiResponseSchema } from '../../dtos/common/api-response';
import { checkRole } from '../../middlewares/check-role.middleware';
import { multerConfig } from '../../config/multer.config';
const router = Router({
  mergeParams: true,
});

registry.registerPath({
  tags: ['Order - Status'],
  path: '/orders/{order_id}/confirm',
  description: 'Staff xác nhận đơn hàng của người dùng',
  method: 'patch',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'order_id',
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
          schema: ApiResponseSchema(orderDto.OrderResponseSchema),
        },
      },
    },
  },
});
router.patch(
  '/confirm',
  authenticateHandler,
  checkRole(['ADMIN', 'STAFF']),
  orderActionController.staffConfirmOrderHandler,
);

registry.registerPath({
  tags: ['Order - Status'],
  path: '/orders/{order_id}/cancel',
  description: 'Người dùng huỷ đơn hàng của họ, hoặc Staff huỷ đơn hàng',
  method: 'delete',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'order_id',
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
          schema: ApiResponseSchema(orderDto.OrderResponseSchema),
        },
      },
    },
  },
});
router.delete(
  '/cancel',
  authenticateHandler,
  orderActionController.cancelOrderHandler,
);

registry.registerPath({
  tags: ['Order - Status'],
  path: '/orders/{order_id}/process',
  description: 'Staff xuất hóa đơn hàng',
  method: 'patch',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'order_id',
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
          schema: ApiResponseSchema(orderDto.OrderResponseSchema),
        },
      },
    },
  },
});
router.patch(
  '/process',
  authenticateHandler,
  checkRole(['ADMIN', 'STAFF']),
  orderActionController.staffProcessingOrderHandler,
);

registry.registerPath({
  tags: ['Order - Status'],
  path: '/orders/{order_id}/deliver',
  description: 'Staff giao hóa đơn hàng',
  method: 'patch',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'order_id',
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
          schema: ApiResponseSchema(orderDto.OrderResponseSchema),
        },
      },
    },
  },
});
router.patch(
  '/deliver',
  authenticateHandler,
  checkRole(['ADMIN', 'STAFF']),
  orderActionController.staffDeliverOrderHandler,
);

registry.registerPath({
  tags: ['Order - Status'],
  path: '/orders/{order_id}/complete',
  description: 'Staff hoàn thanh đơn hàng',
  method: 'patch',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'order_id',
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
          schema: ApiResponseSchema(orderDto.OrderResponseSchema),
        },
      },
    },
  },
});
router.patch(
  '/complete',
  authenticateHandler,
  checkRole(['ADMIN', 'STAFF']),
  orderActionController.staffCompleteOrderHandler,
);

registry.registerPath({
  tags: ['Order - Status'],
  path: '/orders/return-confirm/{order_item_id}',
  description: 'Staff chấp nhận yêu cầu hoàn trả',
  method: 'patch',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'order_item_id',
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
          schema: ApiResponseSchema(orderDto.OrderResponseSchema),
        },
      },
    },
  },
});
router.patch(
  '/return-confirm/:order_item_id',
  authenticateHandler,
  orderReturnController.staffReturnOrderHandler,
);

registry.registerPath({
  tags: ['Order - Status'],
  path: '/orders/return-request/{order_item_id}',
  description:
    'Khách hàng tạo yêu cầu hoàn trả, hoặc Staff tạo yêu cầu hoàn trả trên hệ thống',
  method: 'post',
  security: [
    {
      bearerAuth: [],
    },
  ],
  parameters: [
    {
      name: 'order_item_id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: orderDto.OrderReturnRequestSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(orderDto.OrderReturnResponseSchema),
        },
      },
    },
  },
});
router.post(
  '/return-request/:order_item_id',
  authenticateHandler,
  multerConfig.array('images', 5),
  orderReturnController.createReturnOrderRequestHandler,
);
export default router;
