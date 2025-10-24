import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import adminRouter from './admin.route';
const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
export default router;
