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
import { userModel } from "../users/user.model";
import { permissionToRoleModel } from "../permissions/permission.model";

export const roleModel = pgTable("roles", {
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

export const roleToUserModel = pgTable(
  "role_to_user",
  {
    roleId: integer("role_id")
      .notNull()
      .references(() => roleModel.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => userModel.id, { onDelete: "cascade" }),
  },
  (t) => ({ pk: primaryKey(t.roleId, t.userId) })
);

export const roleToUserRelations = relations(roleToUserModel, ({ one }) => ({
  role: one(roleModel, {
    fields: [roleToUserModel.roleId],
    references: [roleModel.id],
  }),
  user: one(userModel, {
    fields: [roleToUserModel.userId],
    references: [userModel.id],
  }),
}));

export const roleRelations = relations(roleModel, ({ many }) => ({
  roleToUsers: many(roleToUserModel),
  roleToPermission: many(permissionToRoleModel)
}));

export type Role = typeof roleModel.$inferSelect;

export const deletedRoleScope = and(
  isNotNull(roleModel.deletedAt),
  gte(roleModel.deletedAt, sql`now()`)
);

export const activeRoleScope = or(
  isNull(roleModel.deletedAt),
  lt(roleModel.deletedAt, sql`now()`)
);
