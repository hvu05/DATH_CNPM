import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
export default router;
