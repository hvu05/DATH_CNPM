import { Router } from "express";
import reviewRouter from './review.route'

const router = Router()

router.use('/:product_id/reviews', reviewRouter)



export default router