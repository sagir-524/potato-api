import { and, gte, isNotNull, isNull, lt, or, sql } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
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

export type User = typeof user.$inferSelect;

export const verifiedUserScope = and(
  isNotNull(user.verifiedAt),
  gte(user.verifiedAt, sql`now()`)
);

export const unverifiedUserScope = or(
  isNull(user.verifiedAt),
  lt(user.verifiedAt, sql`now()`)
);

export const deletedUserScope = and(
  isNotNull(user.deletedAt),
  gte(user.deletedAt, sql`now()`)
);

export const activeUserScope = or(
  isNull(user.deletedAt),
  lt(user.deletedAt, sql`now()`)
);
