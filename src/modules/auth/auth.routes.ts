import { Router } from "express";
import { login, register, resendVerificationEmail, verify } from "./auth.controller";

const router = Router();

router.post('/register', register);
router.post('/verify/:email/resend', resendVerificationEmail);
router.post('/verify/:email/:code', verify);
router.post('/login', login);

export const authRouter = router;