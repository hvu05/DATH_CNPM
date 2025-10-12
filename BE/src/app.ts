import express from 'express';
import router from './routes';
import { errorHanler } from './middlewares/error.middleware';
const app = express();
const port = 8080 ; // default port to listen

app.use(express.json());
app.use(router);




app.use(errorHanler);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});