import { z } from "zod";
import { db } from "../../../db";
import { roleModel } from "../role.model";
import { and, eq, inArray } from "drizzle-orm";
import {
  activePermissionScope,
  permissionModel,
} from "../../permissions/permission.model";

export const createRoleSchema = z.object({
  name: z.string().trim().min(3).max(80),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(80)
    .refine(
      async (slug) => {
        const res = await db
          .select({ id: roleModel.id })
          .from(roleModel)
          .where(eq(roleModel.slug, slug))
          .limit(1)
          .execute();

        return res.length === 1;
      },
      {
        message: "Role already exisits",
        path: ["slug"],
      }
    ),
  description: z.string().trim().optional(),
  permissions: z
    .array(z.number())
    .min(1)
    .refine(
      async (permissions) => {
        const res = await db
          .select({ id: permissionModel.id })
          .from(permissionModel)
          .where(
            and(activePermissionScope, inArray(permissionModel.id, permissions))
          )
          .execute();

        return res.length === permissions.length;
      },
      {
        message: "One or more selected permission does not exists.",
        path: ["permissions"],
      }
    ),
});