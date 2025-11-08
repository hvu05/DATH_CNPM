import { Router } from "express";
import {
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
  getAllProductsHandler,
  uploadProductImageHandler,
} from "../controllers/product.controller";
import { checkRole } from "../middlewares/check-role.middleware";

const router = Router();

// ------------------- PRODUCT ROUTES -------------------

// Lấy danh sách sản phẩm (query, filter, phân trang) - ai cũng xem
router.get("/", getAllProductsHandler);

// Xem chi tiết sản phẩm theo id - ai cũng xem
router.get("/:id", getProductHandler);

// Thêm sản phẩm mới - chỉ admin
router.post("/", checkRole(["ADMIN"]), createProductHandler);

// Cập nhật sản phẩm theo id - chỉ admin
router.put("/:id", checkRole(["ADMIN"]), updateProductHandler);

// Xóa sản phẩm theo id - chỉ admin
router.delete("/:id", checkRole(["ADMIN"]), deleteProductHandler);

// Upload ảnh cho sản phẩm theo id - admin hoặc seller
router.post("/:id/upload", checkRole(["ADMIN", "SELLER"]), uploadProductImageHandler);

export default router;
