import { Router } from 'express';
import {
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductHandler,
  getAllProductsHandler,
  uploadProductImageHandler,
} from '../controllers/product.controller';
import { checkRole } from '../middlewares/check-role.middleware';
import { authenticateHandler } from '../middlewares/authenticate.middleware';
import reviewRouter from './review.route';
import { multerConfig } from '../config/multer.config';
import { registry } from '../config/openapi.config';
import { ProductCreateSchema } from '../dtos/product/product-create.request';
import { ProductResponseSchema } from '../dtos/product/product.response';
import { ApiResponseSchema } from '../dtos/common/api-response';
import { ProductListResponseSchema } from '../dtos/product/product-list.response';
import { ProductFilterSchema } from '../dtos/product/product-filter.request';

const router = Router();

// ------------------- PRODUCT ROUTES -------------------

// Lấy danh sách sản phẩm (query, filter, phân trang) - ai cũng xem
registry.registerPath({
  tags: ['Product'],
  path: '/products',
  method: 'get',
  request: {
    query: ProductFilterSchema,
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(ProductListResponseSchema),
        },
      },
    },
  },
});
router.get('/', getAllProductsHandler);

// Xem chi tiết sản phẩm theo id - ai cũng xem
registry.registerPath({
  tags: ['Product'],
  path: '/products/{id}',
  method: 'get',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
    },
  ],
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(ProductResponseSchema),
        },
      },
    },
  },
});
router.get('/:id', getProductHandler);

// Thêm sản phẩm mới - chỉ admin
registry.registerPath({
  tags: ['Product'],
  path: '/products',
  method: 'post',
  security: [
    {
      bearerAuth: [],
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: ProductCreateSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Thêm sản phẩm mới',
      content: {
        'application/json': {
          schema: ApiResponseSchema(
            ProductResponseSchema.omit({
              reviews: true,
            }),
          ),
        },
      },
    },
  },
});
router.post(
  '/',
  authenticateHandler,
  checkRole(['ADMIN']),
  multerConfig.array('images'),
  createProductHandler,
);

// Cập nhật sản phẩm theo id - chỉ admin
router.put(
  '/:id',
  authenticateHandler,
  checkRole(['ADMIN']),
  updateProductHandler,
);

// Xóa sản phẩm theo id - chỉ admin
router.delete(
  '/:id',
  authenticateHandler,
  checkRole(['ADMIN']),
  deleteProductHandler,
);

// Upload ảnh cho sản phẩm theo id - admin hoặc seller
router.post(
  '/:id/upload',
  authenticateHandler,
  checkRole(['ADMIN', 'SELLER']),
  multerConfig.single('file'),
  uploadProductImageHandler,
);

router.use('/:product_id/reviews', reviewRouter);

export default router;
