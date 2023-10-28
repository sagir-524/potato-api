import { hashSync } from "bcrypt";
import { db } from "../../src/db";
import { userModel } from "../../src/modules/users/user.model";
import { sql } from "drizzle-orm";

export const name = 'Users seeder'

export function run () {
  return db
    .insert(userModel)
    .values([
      {
        name: "Sagir Hossain",
        email: "sagir.hossain.524@gmail.com",
        password: hashSync("123456", 10),
        isAdmin: true,
        isSuperAdmin: true,
        verifiedAt: sql`now()`,
      },
      {
        name: "John Doe",
        email: "john@doe.com",
        password: hashSync('123456', 10),
        isAdmin: true,
        isSuperAdmin: false,
        verifiedAt: sql`now()`,
      },
      {
        name: "Jane Doe",
        email: "jane@doe.com",
        password: hashSync('123456', 10),
        isAdmin: true,
        isSuperAdmin: false,
        verifiedAt: sql`now()`,
      }
    ])
    .returning()
    .execute()
}
