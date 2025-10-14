import { Router } from 'express'
import { createUserHandler } from '../controllers/user.controller'

const router = Router()

router.post('/login', createUserHandler)
export default router