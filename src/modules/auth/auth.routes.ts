import { Router } from "express";
import { register, resendVerificationEmail, verify } from "./auth.controller";

const router = Router();

router.post('/register', register);
router.post('/verify/:email/resend', resendVerificationEmail);
router.post('/verify/:email/:code', verify);

export const authRouter = router;