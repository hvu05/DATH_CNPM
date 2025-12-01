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
const port = config.port; // default port to listen

// init middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Chỉ định rõ Frontend URL
    credentials: true, // Cho phép nhận cookie/header xác thực
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
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
