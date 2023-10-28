import { Router } from "express";
import { checkPermissions } from "../../middlewares/permission.middleware";
import { create } from "./roles.controller";

const router = Router();

router.post('/', checkPermissions(['role.create']), create);

export const rolesRouter = router;