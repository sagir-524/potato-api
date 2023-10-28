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

export const checkPermission = (permissions: string[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const { id } = req.user as User;
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

    throw new ForbiddenException('You do not have sufficient permisions to perform this action.');
  };
};
