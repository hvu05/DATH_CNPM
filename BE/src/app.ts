import express from 'express';
import router from './routes';
import { errorHanler } from './middlewares/error.middleware';
import config from './config/config';
import cors from "cors";
const app = express();
const port = config.port; // default port to listen

// init middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);



app.use(errorHanler);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});