import { Router } from 'express'
import * as userController from '../controllers/admin/user.controller'
import * as productController from '../controllers/admin/product.controller'

import { authenticateHandler } from '../middlewares/authenticate.middleware'
import { checkRole } from '../middlewares/check-role.middleware'
const router = Router()

// Admin APIs (chỉ ADMIN được truy cập)
router.get('/users', authenticateHandler, checkRole(["ADMIN"]), userController.getAllUsersHandler)
router.get('/users/static', authenticateHandler, checkRole(['ADMIN']), userController.getUsersStaticHandler);
router.get('/users/roles', authenticateHandler, checkRole(['ADMIN']), userController.getAllRolesHandler);
router.put('/users/:id', authenticateHandler, checkRole(['ADMIN']), userController.updateUserByAdminHandler);

// For product page
router.get('/products', authenticateHandler, checkRole(["ADMIN"]), productController.getAllProductsHandler);
router.get('/categories', authenticateHandler, checkRole(["ADMIN"]), productController.getAllCategories);
router.get('/brands', authenticateHandler, checkRole(["ADMIN"]), productController.getBrands);
router.get('/series', authenticateHandler, checkRole(["ADMIN"]), productController.getSeries);
router.post('/products', authenticateHandler, checkRole(["ADMIN"]), productController.createNewProduct);

export default router