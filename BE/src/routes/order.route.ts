import * as orderController from '../controllers/order.controller';
import { Router } from 'express';
import { authenticateHandler } from '../middlewares/authenticate.middleware';

const router = Router();

router.post('/', authenticateHandler, orderController.createOrderHandler);
// router.get('/', authenticateHandler, checkRole("USER"), orderController.getOrdersHandler);

export default router;
