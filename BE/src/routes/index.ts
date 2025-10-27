import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import adminRouter from './admin.route';
import uploadRouter from './upload.route';
const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/upload', uploadRouter);
export default router;
