// api/src/lib/mailer.ts
import nodemailer from "nodemailer";
import { config } from "../config";

export const mailer = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export async function sendResetPasswordMail(
  to: string,
  resetUrl: string
) {
  if (!config.smtp.from) {
    throw new Error("SMTP_FROM が設定されていません");
  }

  await mailer.sendMail({
    from: config.smtp.from,
    to,
    subject: "Quizwell パスワード再設定のお知らせ",
    text: `以下のリンクからパスワードを再設定してください:\n\n${resetUrl}\n\nこのリンクは30分で無効になります。`,
    html: `
      <p>以下のリンクからパスワードを再設定してください。</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>このリンクは30分で無効になります。</p>
    `,
  });
}