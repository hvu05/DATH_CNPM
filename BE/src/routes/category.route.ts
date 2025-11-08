import { Router } from "express";
import { createCategoryHandler, getAllCategoriesHandler } from "../controllers/category.controller";
import { checkRole } from "../middlewares/check-role.middleware";

const router = Router();

// Chỉ admin được phép tạo category
router.post("/", checkRole(["ADMIN"]), createCategoryHandler);

// ✅ Lấy danh sách category (ai cũng có thể xem)
router.get("/", getAllCategoriesHandler);

export default router;
