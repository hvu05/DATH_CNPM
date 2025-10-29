import * as paymentController from '../controllers/payment.controller'
import { Router } from 'express'
import { authenticateHandler } from '../middlewares/authenticate.middleware'
import { checkRole } from '../middlewares/check-role.middleware'
import { de } from 'zod/v4/locales'

const router = Router()
router.get('/vnpay-verify', paymentController.verifyPaymentHandler) 
router.post('/', authenticateHandler, checkRole('CUSTOMER'), paymentController.createPaymentHandler)
export default router