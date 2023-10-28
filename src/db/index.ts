import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import { userModel } from "../modules/users/user.model";
import { roleModel, roleToUserModel } from "../modules/roles/role.model";
import { permissionModel, permissionToRoleModel } from "../modules/permissions/permission.model";

dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  max: 5,
  ssl: true,
});

pool.on("connect", () => console.log("PG connected"));
pool.on("error", (err) => {
  console.warn("Database error occured");
  console.error(err);
});

export const db = drizzle(pool, {
  logger: true,
  schema: {
    user: userModel,
    role: roleModel,
    permission: permissionModel,
    roleToUse: roleToUserModel,
    permissionToRole: permissionToRoleModel,
  },
});
