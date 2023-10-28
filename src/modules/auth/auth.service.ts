import { eq, sql } from "drizzle-orm";
import { db } from "../../db";
import { mailQueue } from "../../queues/mail.queue";
import { redis } from "../../redis";
import { User, userModel } from "../users/user.model";
import { init } from "@paralleldrive/cuid2";
import jwt from "jsonwebtoken";

export const sendUserVerificationMail = async (user: User): Promise<void> => {
  const cuid = init({ length: 32 })();
  await redis.setex(`user:${user.id}:verify:${cuid}`, 60 * 30, user.email);
  mailQueue.add(
    {
      to: user.email,
      subject: "OMS Email verification",
      html: `<h3>To verify your email, please click <a href="${process.env.APP_URL}/auth/verify/${user.email}/${cuid}">here</a></h3>`,
    },
    { attempts: 3 }
  );
};

export const verifyUser = async (
  { id, email }: User,
  cuid: string
): Promise<boolean> => {
  const res = await redis.get(`user:${id}:verify:${cuid}`);

  if (res === email) {
    const dbRes = await db
      .update(userModel)
      .set({ verifiedAt: sql`now()`, updatedAt: sql`now()` })
      .where(eq(userModel.id, id))
      .returning()
      .execute();

    const keys = await redis.keys(`user:${id}:verify:*`);
    console.log(keys);
    const pipeline = redis.pipeline();
    keys.forEach((key) => pipeline.del(key));
    await pipeline.exec();

    return dbRes.length === 1;
  }

  return false;
};

export const getTokens = async (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    algorithm: "HS256",
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    algorithm: "HS512",
    expiresIn: "2d",
  });

  await redis.setex(
    `user:${user.id}:refresh-token:${token}`,
    60 * 60 * 24 * 2,
    user.email
  );

  return { token, refreshToken, user };
};
