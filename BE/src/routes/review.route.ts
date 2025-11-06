import { Router } from "express";

import * as reviewController from "../controllers/review.controller";
import { authenticateHandler } from "../middlewares/authenticate.middleware";

const router = Router({
  mergeParams: true
});

router.post("/",authenticateHandler, reviewController.createReviewHandler);
router.get("/", reviewController.getReviewsHandler);

export default router