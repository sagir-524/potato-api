import { Router } from "express";
import {
  login,
  profile,
  refreshTokens,
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
router.post("/refresh-tokens", refreshTokens);

export const authRouter = router;
