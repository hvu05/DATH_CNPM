import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import paymentRouter from './payment.route'
import orderRouter from './order.route'
const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/payments', paymentRouter);
router.use('/orders', orderRouter)
export default router;
