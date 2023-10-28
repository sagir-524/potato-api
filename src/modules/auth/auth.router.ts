import { Router } from "express";
import {
  login,
  profile,
  register,
  resendVerificationEmail,
  verify,
} from "./auth.controller";
import passport from "passport";

const router = Router();

router.post("/register", register);
router.post("/verify/:email/resend", resendVerificationEmail);
router.post("/verify/:email/:code", verify);
router.post("/login", login);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  profile
);

export const authRouter = router;
