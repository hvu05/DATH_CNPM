import { Router } from 'express'
import * as userController from '../controllers/user.controller'

import { authenticateHandler } from '../middlewares/authenticate.middleware'
import { checkRole } from '../middlewares/check-role.middleware'
const router = Router()

router.post('/', authenticateHandler, checkRole(["ADMIN"]), userController.createAddressHandler)
router.get('/profile', authenticateHandler, userController.getProfileHandler)
router.put('/profile', authenticateHandler, userController.updateProfileHandler)

router.post('/address', authenticateHandler, userController.createAddressHandler)
export default router