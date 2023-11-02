import { Router } from "express";
import {
  changePassword,
  requestPasswordReset,
  resetPassword,
} from "./password.controller";
import passport from "passport";

const router = Router();

router.post("/request-reset", requestPasswordReset);
router.post("/reset", resetPassword);
router.post(
  "/change",
  passport.authenticate("jwt", { session: false }),
  changePassword
);

export const passwordRouter = router;
