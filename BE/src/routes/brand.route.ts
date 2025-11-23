import { Router } from "express";
import { createBrandHandler, updateBrandHandler, deleteBrandHandler, getBrandHandler, getAllBrandsHandler } from "../controllers/brand.controller";
import { authenticateHandler } from "../middlewares/authenticate.middleware";
import { checkRole } from "../middlewares/check-role.middleware";

const router = Router();

// Admin only
router.post("/", authenticateHandler, checkRole(["ADMIN"]), createBrandHandler);
router.put("/:id", authenticateHandler, checkRole(["ADMIN"]), updateBrandHandler);
router.delete("/:id", authenticateHandler, checkRole(["ADMIN"]), deleteBrandHandler);

// Public
router.get("/:id", getBrandHandler);
router.get("/", getAllBrandsHandler);

export default router;
