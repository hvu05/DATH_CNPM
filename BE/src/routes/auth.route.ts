import { Router } from 'express'
import * as authController from '../controllers/auth.controller'

const router = Router()

router.post('/login', authController.loginHandler)
router.post('/send-otp', authController.sendOtpForRegisterHandler)
router.post('/register', authController.registerHandler)
export default router