import * as paymentController from '../controllers/payment.controller'
import { Router } from 'express'
import { authenticateHandler } from '../middlewares/authenticate.middleware'
import { checkRole } from '../middlewares/check-role.middleware'
import { registry } from '../config/openapi.config'
import * as paymentDto from '../dtos/payment'
import { ApiResponseSchema } from '../dtos/common/api-response'
const router = Router()

registry.registerPath({
  tags: ['Payment'],
  path: '/payments/vnpay-verify',
  method: 'get',
  request: {
    query: paymentDto.VnpayQuerySchema,
  }, 
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(paymentDto.PaymentResponseSchema)
        }
      }
    }
  }
})
router.get('/vnpay-verify', paymentController.verifyPaymentHandler) 


registry.registerPath({
  tags: ['Payment'],
  path: '/payments',
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
          schema: paymentDto.paymentCreateSchema
        }
      }
    }
  },
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(paymentDto.PaymentCreateResponseSchema)
        }
      }
    }
  }
})
router.post('/', authenticateHandler, checkRole('CUSTOMER'), paymentController.createPaymentHandler)
export default router