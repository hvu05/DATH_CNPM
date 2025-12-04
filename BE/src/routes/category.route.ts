import { Router } from 'express';
import {
  createCategoryHandler,
  getAllCategoriesHandler,
} from '../controllers/category.controller';
import { authenticateHandler } from '../middlewares/authenticate.middleware';
import { checkRole } from '../middlewares/check-role.middleware';

const router = Router();

// Chỉ admin được phép tạo category
router.post(
  '/',
  authenticateHandler, // 1️⃣ Giải token + gắn req.user
  checkRole(['ADMIN']), // 2️⃣ Kiểm tra role
  createCategoryHandler, // 3️⃣ Xử lý logic
);

// Lấy danh sách category (không cần đăng nhập)
router.get('/', getAllCategoriesHandler);

export default router;
