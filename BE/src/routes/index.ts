import { Router } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import adminRouter from './admin.route';
import uploadRouter from './upload.route';
import categoryRouter from "./category.route";
import productRouter from "./product.route";
const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/upload', uploadRouter);
router.use('/category', categoryRouter);
router.use('/product', productRouter);
export default router;
