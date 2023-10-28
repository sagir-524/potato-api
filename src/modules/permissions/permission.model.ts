import {
  and,
  gte,
  isNotNull,
  isNull,
  lt,
  or,
  relations,
  sql,
} from "drizzle-orm";
import { integer, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { roleModel } from "../roles/role.model";

export const permissionModel = pgTable("permissions", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 80 }).notNull(),
  slug: varchar("slug", { length: 80 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    precision: 6,
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  deletedAt: timestamp("deleted_at", {
    precision: 6,
    withTimezone: true,
    mode: "date",
  }),
});

export const permissionToRoleModel = pgTable(
  "permission_to_role",
  {
    permissionId: integer("permission_id")
      .notNull()
      .references(() => permissionModel.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => roleModel.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey(t.roleId, t.permissionId) })
);

export const permsisionToRoleRelations = relations(permissionToRoleModel, ({ one }) => ({
  permission: one(permissionModel, {
    fields: [permissionToRoleModel.permissionId],
    references: [permissionModel.id],
  }),
  role: one(roleModel, {
    fields: [permissionToRoleModel.roleId],
    references: [roleModel.id],
  }),
}));

export const permissionRelations = relations(
  permissionToRoleModel,
  ({ many }) => ({
    permissionToRole: many(permissionToRoleModel),
  })
);

export type Permission = typeof permissionModel.$inferSelect;

export const deletedPermissionScope = and(
  isNotNull(permissionModel.deletedAt),
  gte(permissionModel.deletedAt, sql`now()`)
);

export const activePermissionScope = or(
  isNull(permissionModel.deletedAt),
  lt(permissionModel.deletedAt, sql`now()`)
);
