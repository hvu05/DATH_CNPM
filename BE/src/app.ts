// BE/src/app.ts
import './config/zod-open-api.config';
import express from 'express';
import router from './routes';
import { errorHanler } from './middlewares/error.middleware';
import config from './config/config';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApi } from './config/openapi.config';

BigInt.prototype.toJSON = function () {
  return this.toString();
};
const app = express();
// Đảm bảo port là số (ép kiểu cho chắc chắn)
const port = Number(config.port) || 8080;

// 1. SỬA CORS: Cho phép cả localhost và 127.0.0.1
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const openapi = generateOpenApi();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

// Route
app.use(router);

app.use(errorHanler);

// 2. QUAN TRỌNG NHẤT: Thêm tham số '0.0.0.0' vào hàm listen
// Điều này bắt buộc server lắng nghe trên mọi dải IP (bao gồm 127.0.0.1)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server đang chạy tại: http://localhost:${port}`);
  console.log(`Server truy cập được tại: http://127.0.0.1:${port}`);
});
