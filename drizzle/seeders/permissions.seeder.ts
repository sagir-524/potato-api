import { db } from "../../src/db";
import { permissionModel } from "../../src/modules/permissions/permission.model";

export const name = 'Permissions seeder';

export function run () {
  return db.insert(permissionModel).values([
    {
      name: "View role",
      slug: "role.view",
    },
    {
      name: 'Create role',
      slug: 'role.create',
    },
    {
      name: 'Update role',
      slug: 'role.update',
    },
    {
      name: 'Delete role',
      slug: 'role.delete',
    }
  ])
  .returning()
  .execute()
}
