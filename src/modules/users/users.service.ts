import { hash } from "bcrypt";
import { db } from "../../db";
import { User, activeUserScope, deletedUserScope, unverifiedUserScope, userModel, verifiedUserScope } from "./user.model";
import { SQL, and, eq } from "drizzle-orm";

export const createUser = async (
  data: Pick<User, "name" | "email" | "password">
): Promise<User> => {
  const [newUser] = await db
    .insert(userModel)
    .values([
      {
        name: data.name,
        email: data.email,
        password: await hash(data.password, 10),
        verifiedAt: null,
      },
    ])
    .returning()
    .execute();

  return newUser;
};

export const getUser = async <T extends keyof Pick<User, "id" | "email">>(
  findBy: T,
  value: User[T],
  verified?: boolean,
  deleted?: boolean,
): Promise<User | undefined> => {
  const column = userModel[findBy];

  const filters: Array<SQL<unknown> | undefined> = [];

  if (verified !== undefined) {
    filters.push(verified ? verifiedUserScope : unverifiedUserScope);
  }

  if (deleted !== undefined) {
    filters.push(deleted ? deletedUserScope : activeUserScope);
  }

  return db.query.user.findFirst({
    where: and(
      eq(column, value),
      ...filters
    ),
  }).execute();
};
