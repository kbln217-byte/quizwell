import nodemailer from "nodemailer";
import { config } from "../config";

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export async function sendResetPasswordMail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: config.smtp.from,
    to,
    subject: "【Quizwell】パスワード再設定のご案内",
    text: `以下のURLからパスワードを再設定してください。\n\n${resetUrl}`,
  });
}