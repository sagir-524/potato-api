import compression from "compression";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { errorLogHandler } from "./exceptions/handlers/error-log.handler";
import { zodErrorhandler } from "./exceptions/handlers/zod-error.handler";
import { authRouter } from "./modules/auth/auth.router";
import { defaultErrorHandler } from "./exceptions/handlers/default-error.handler";
import { NotFoundException } from "./exceptions/not-found.exception";
import passport from "passport";
import { jwtStrategy } from "./modules/auth/strategies/jwt.strategy";
import { isAdmin } from "./middlewares/admin.middleware";
import { rolesRouter } from "./modules/roles/roles.router";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.set('trust proxy', true);

passport.use(jwtStrategy);
app.use(passport.initialize());

app.get("/ping", (req: Request, res: Response) => {
  console.log(req.ips, req.ip, req.headers);
  res.status(200).send("pong")
});
app.use("/auth", authRouter);

app.use(
  "/admin/roles",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  rolesRouter
);

app.all("*", () => {
  throw new NotFoundException();
});

app.use(errorLogHandler);
app.use(zodErrorhandler);
app.use(defaultErrorHandler);

app.listen(process.env.APP_PORT, () => {
  console.log(`Application is running on ${process.env.APP_URL}`);
});
