import { NextFunction, Request, RequestHandler, Response } from "express";
import { db } from "../db";
import { roleToUserModel } from "../modules/roles/role.model";
import {
  permissionModel,
  permissionToRoleModel,
} from "../modules/permissions/permission.model";
import { and, eq, inArray } from "drizzle-orm";
import { User } from "../modules/users/user.model";
import { ForbiddenException } from "../exceptions/forbidder.exception";

export const checkPermissions = (permissions: string[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const { id, isAdmin, isSuperAdmin } = req.user as User;

      if (isSuperAdmin) {
        next();
      } else if (isAdmin) {
        const result = await db
          .select({ slug: permissionModel.slug })
          .from(roleToUserModel)
          .innerJoin(
            permissionToRoleModel,
            eq(roleToUserModel.roleId, permissionToRoleModel.roleId)
          )
          .innerJoin(
            permissionModel,
            eq(permissionModel.id, permissionToRoleModel.permissionId)
          )
          .where(
            and(
              eq(roleToUserModel.userId, id),
              inArray(permissionModel.slug, permissions)
            )
          )
          .execute();

        if (result.length === permissions.length) {
          next();
        }
      }
    }

    throw new ForbiddenException('You do not have sufficient permisions to perform this action.');
  };
};
