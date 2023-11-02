import { sql } from "drizzle-orm";
import { mailQueue } from "../../queues/mail.queue";
import { redis } from "../../redis";
import { User } from "../users/user.model";
import { init } from "@paralleldrive/cuid2";
import jwt from "jsonwebtoken";
import { getUser, updateUser } from "../users/users.service";
import { NotFoundException } from "../../exceptions/not-found.exception";
import { BadRequestException } from "../../exceptions/bad-request.exception";
import { batchDelete } from "../../helpers/redis-helpers";

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
  user: User,
  cuid: string
): Promise<boolean> => {
  const { id, email } = user;
  const res = await redis.get(`user:${id}:verify:${cuid}`);

  if (res === email) {
    const updatedUser = await updateUser(user, { verifiedAt: sql`now()` })

    if (!updatedUser) {
      return false;
    }

    // deleting all keys and not waiting for them
    batchDelete(`user:${id}:verify:*`)
    return true;
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
    `user:${user.id}:refresh-token:${refreshToken}`,
    60 * 60 * 24 * 2,
    user.email
  );

  return { token, refreshToken, user };
};

export const getTokenViaRefreshToken = async (refreshToken: string) => {
  const { id } = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as {
    id: number;
  };
  const user = await getUser("id", id);

  if (!user) {
    throw new NotFoundException("User not found");
  }

  const redisKey = `user:${id}:refresh-token:${refreshToken}`;
  const email = await redis.get(redisKey);

  if (!email || email !== user.email) {
    throw new BadRequestException("Invalid token");
  }

  await redis.del(redisKey);
  return await getTokens(user);
};
