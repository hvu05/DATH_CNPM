import { Router } from 'express'
import * as adminController from '../controllers/admin.controller'

import { authenticateHandler } from '../middlewares/authenticate.middleware'
import { checkRole } from '../middlewares/check-role.middleware'
const router = Router()

// Admin APIs (chỉ ADMIN được truy cập)
router.get('/users', authenticateHandler, checkRole(["ADMIN"]), adminController.getAllUsersHandler)
router.get('/users/static', authenticateHandler, checkRole(['ADMIN']), adminController.getUsersStaticHandler);
router.get('/users/roles', authenticateHandler, checkRole(['ADMIN']), adminController.getAllRolesHandler);
router.put('/users/:id', authenticateHandler, checkRole(['ADMIN']), adminController.updateUserByAdminHandler);

export default router