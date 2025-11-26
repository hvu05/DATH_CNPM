import { Router } from 'express';
import * as uploadController from '../controllers/upload.controller';
import { multerConfig } from '../config/multer.config';
import { authenticateHandler } from '../middlewares/authenticate.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateHandler);

// Upload image endpoint
router.post(
  '/',
  multerConfig.single('image'),
  uploadController.uploadImageHandler,
);

// upload multiple image
router.post(
  '/multiple',
  multerConfig.array('images'),
  uploadController.uploadMultipleImageHandler,
)

// Delete image endpoint
router.delete('/', uploadController.deleteImageHandler);

router.post('/multiple', multerConfig.array('images'), uploadController.testHandler);
export default router;
