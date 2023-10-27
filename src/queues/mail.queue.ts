import Queue, { DoneCallback, Job } from "bull";
import dotenv from "dotenv";
import { MailOptions, mailer } from "../mailer";

dotenv.config();

export const mailQueue = new Queue<MailOptions>('mail-queue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
});

mailQueue.process(async (job: Job<MailOptions>, done: DoneCallback) => {
  try {
    await mailer.sendMail(job.data);
    done(null, `Mail sent to ${job.data.to}`);
  } catch (error) {
    done(new Error('Sending mail failed'));
  }
});

