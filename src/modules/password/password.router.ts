import { Router } from "express";
import { requestPasswordReset, resetPassword } from "./password.controller";

const router = Router();

router.post('/request-reset', requestPasswordReset);
router.post('/reset', resetPassword);

export const passwordRouter = router;