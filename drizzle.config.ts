import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/**/*.model.ts",
  driver: "pg",
  dbCredentials: {
    host: (process.env.PG_HOST || 'localhost') as string,
    port: Number(process.env.PG_PORT),
    user: process.env.PG_USER as string,
    password: process.env.PG_PASSWORD as string,
    database: process.env.PG_DATABASE as string,
  },
  out: './drizzle/migrations',
  strict: true,
} satisfies Config;
