import compression from "compression";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorLogHandler } from "./exceptions/handlers/error-log.handler";
import { zodErrorhandler } from "./exceptions/handlers/zod-error.handler";
import { authRouter } from "./modules/auth/auth.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.get('/ping', (req: Request, res: Response) => res.send('pong'));
app.use('/auth', authRouter);

app.use(errorLogHandler);
app.use(zodErrorhandler);

app.listen(process.env.APP_PORT, () => {
  console.log(`Application is running on ${process.env.APP_URL}`);
});
