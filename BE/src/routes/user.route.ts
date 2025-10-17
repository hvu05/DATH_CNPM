import { Router } from 'express'
import { createUserHandler, getProfileHandler } from '../controllers/user.controller'
import { authenticateHandler } from '../middlewares/authenticate.middleware'
import { checkRole } from '../middlewares/check-role.middleware'
const router = Router()

router.post('/', authenticateHandler, checkRole("ADMIN"), createUserHandler)
router.get('/profile',authenticateHandler, getProfileHandler)
export default router