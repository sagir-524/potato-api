import { createTransport, SendMailOptions } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const mailer = createTransport({
  
  authMethod: 'PLAIN',
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  from: "noreply@oms.com",
});

export type MailOptions = Pick<SendMailOptions, 'from' | 'to' | 'subject' | 'cc' | 'bcc' | 'text' | 'html'>;