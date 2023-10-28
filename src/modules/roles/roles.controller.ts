import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/async-handler";
import { createRoleSchema } from "./schemas/create-role.schema";
import { db } from "../../db";
import { roleModel } from "./role.model";
import { permissionToRoleModel } from "../permissions/permission.model";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { name, slug, description, permissions } =
    await createRoleSchema.parseAsync(req.body);

  try {
    const role = await db.transaction(async (trx) => {
      const [role] = await trx
        .insert(roleModel)
        .values([{ name, slug, description }])
        .returning()
        .execute();

      await trx
        .insert(permissionToRoleModel)
        .values(
          permissions.map((permissionId) => ({ permissionId, roleId: role.id }))
        );

      return role;
    });

    res.status(201).json(role);
  } catch (err) {
    console.log(err);
    throw new Error();
  }
});
