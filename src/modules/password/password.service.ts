import { init } from "@paralleldrive/cuid2";
import { User } from "../users/user.model";
import { redis } from "../../redis";
import { mailQueue } from "../../queues/mail.queue";
import { BadRequestException } from "../../exceptions/bad-request.exception";
import { updateUser } from "../users/users.service";
import { hashPassword } from "../../helpers/common";
import { batchDelete } from "../../helpers/redis-helpers";

export const sendPasswordResetEmail = async ({ id, email }: User) => {
  const cuid = init({ length: 48 })();
  await redis.setex(`user:${id}:reset-password:${cuid}`, 60 * 30, email);
  mailQueue.add({
    to: email,
    subject: "OMS reset password",
    html: `<h3>To reset your password, please click <a href="${process.env.APP_URL}/auth/password/${email}/${cuid}">here</a></h3>`,
  });
};

export const updateUserPassword = async (
  user: User,
  cuid: string,
  password: string
) => {
  const email = await redis.get(`user:${user.id}:reset-password:${cuid}`);

  if (!email || email !== user.email) {
    throw new BadRequestException(
      "Password reset token is invalid or expired."
    );
  }

  const updatedUser = await updateUser(user, { password: await hashPassword(password) });

  if (!updatedUser) {
    return false;
  }

  // deleting all keys and not waiting for them
  batchDelete(`user:${user.id}:reset-password:*`);
  return true;
};
