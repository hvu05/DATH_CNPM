import * as paymentController from '../controllers/payment.controller'
import { Router } from 'express'
import { authenticateHandler } from '../middlewares/authenticate.middleware'
import { checkRole } from '../middlewares/check-role.middleware'
import { de } from 'zod/v4/locales'

const router = Router()
router.post('/vnpay-return', (req, res) => {
    console.log('BODY CỦA VNPAY   ',req.body)

}) 
router.post('/', authenticateHandler, checkRole('CUSTOMER'), paymentController.createPaymentHandler)
router.post('/verify-vnpay')
export default router