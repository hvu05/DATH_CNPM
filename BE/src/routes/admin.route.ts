import { Router } from 'express';
import * as userController from '../controllers/admin/user.controller';
import * as productController from '../controllers/admin/product.controller';
import * as inventoryController from '../controllers/admin/inventory.controller';

import { authenticateHandler } from '../middlewares/authenticate.middleware';
import { checkRole } from '../middlewares/check-role.middleware';
import { multerConfig } from '../config/multer.config';

const router = Router();

// Admin APIs (chỉ ADMIN được truy cập)
router.get(
  '/users',
  authenticateHandler,
  checkRole(['ADMIN']),
  userController.getAllUsersHandler,
);
router.get(
  '/users/static',
  authenticateHandler,
  checkRole(['ADMIN']),
  userController.getUsersStaticHandler,
);
router.get(
  '/users/roles',
  authenticateHandler,
  checkRole(['ADMIN']),
  userController.getAllRolesHandler,
);
router.put(
  '/users/:id',
  authenticateHandler,
  checkRole(['ADMIN']),
  userController.updateUserByAdminHandler,
);

// For product page
router.get(
  '/products',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.getAllProductsHandler,
);
router.get(
  '/categories',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.getAllCategories,
);
router.get(
  '/brands',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.getBrands,
);
router.get(
  '/series',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.getSeries,
);
// POST with multer for image uploads - max 10 images
router.post(
  '/products',
  authenticateHandler,
  checkRole(['ADMIN']),
  multerConfig.array('images', 10),
  productController.createNewProduct,
);

// GET product detail by ID
router.get(
  '/products/:id',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.getProductDetailHandler,
);

// ==================== SEPARATE UPDATE APIs ====================
// PUT to update product basic info only
router.put(
  '/products/:id/info',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.updateProductInfoHandler,
);

// PUT to update product variants only
router.put(
  '/products/:id/variants',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.updateProductVariantsHandler,
);

// PUT to update product specifications only
router.put(
  '/products/:id/specs',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.updateProductSpecsHandler,
);

// PUT to update product images only
router.put(
  '/products/:id/images',
  authenticateHandler,
  checkRole(['ADMIN']),
  multerConfig.array('images', 10),
  productController.updateProductImagesHandler,
);

// PATCH to update product status (publish/unpublish)
router.patch(
  '/products/:id/status',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.updateProductStatus,
);

// POST to create new category
router.post(
  '/categories',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.createCategory,
);

// POST to create new brand
router.post(
  '/brands',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.createBrand,
);

// POST to create new series
router.post(
  '/series',
  authenticateHandler,
  checkRole(['ADMIN']),
  productController.createSeries,
);

// ==================== INVENTORY LOGS ====================
// GET inventory logs
router.get(
  '/inventory-logs',
  authenticateHandler,
  checkRole(['ADMIN']),
  inventoryController.getLogsHandler,
);

// GET inventory summary
router.get(
  '/inventory-logs/summary',
  authenticateHandler,
  checkRole(['ADMIN']),
  inventoryController.getSummaryHandler,
);

export default router;
