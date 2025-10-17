import { Router } from 'express'
import { loginHandler, registerHandler, sendOtpForRegisterHandler } from '../controllers/auth.controller'
const router = Router()

router.post('/login', loginHandler)
router.post('/send-otp', sendOtpForRegisterHandler)
router.post('/register', registerHandler)
export default router