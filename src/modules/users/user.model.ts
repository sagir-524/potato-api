import { and, gte, isNotNull, isNull, lt, or, relations, sql } from "drizzle-orm";
import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { roleToUserModel } from "../roles/role.model";

export const userModel = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  isSuperAdmin: boolean("is_super_admin").notNull().default(false),
  verifiedAt: timestamp("verified_at", {
    precision: 6,
    withTimezone: true,
    mode: "date",
  }),
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

export const userRelations = relations(userModel, ({ many }) => ({
  userToRoles: many(roleToUserModel)
}))

export type User = typeof userModel.$inferSelect;

export const verifiedUserScope = and(
  isNotNull(userModel.verifiedAt),
  lt(userModel.verifiedAt, sql`now()`)
);

export const unverifiedUserScope = or(
  isNull(userModel.verifiedAt),
  gte(userModel.verifiedAt, sql`now()`)
);

export const deletedUserScope = and(
  isNotNull(userModel.deletedAt),
  gte(userModel.deletedAt, sql`now()`)
);

export const activeUserScope = or(
  isNull(userModel.deletedAt),
  lt(userModel.deletedAt, sql`now()`)
);
