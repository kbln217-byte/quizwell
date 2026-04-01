import * as jwt from "jsonwebtoken";
import { prisma } from "../db";
import { Prisma } from "@prisma/client";
import { config } from "../config";
import {
  createUser,
  findByEmail,
  findAllUsers,
  findByIdUser,
  deleteUserById,
  putUser,
} from "./users.repo";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";


export type JwtPayload = {
  sub: number;
};

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function isSmtpConfigured() {
  const host = config.smtp.host?.trim().toLowerCase();
  if (!host) {
    return false;
  }
  if (host === "example.com" || host.endsWith(".example.com")) {
    return false;
  }

  return Boolean(
    config.smtp.port > 0 &&
      config.smtp.user &&
      config.smtp.pass
  );
}

function createSmtpTransport() {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
}

async function sendResetPasswordEmail(email: string, token: string) {
  const resetUrl = `${config.frontendBaseUrl}/change-password?token=${token}`;
  const transport = createSmtpTransport();

  const message = {
    from: config.smtp.from,
    to: email,
    subject: "Quizwell パスワード再設定のお知らせ",
    text: `以下のリンクからパスワードを再設定してください:\n\n${resetUrl}\n\nこのリンクは30分で無効になります。`,
    html: `
      <p>以下のリンクからパスワードを再設定してください。</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>このリンクは30分で無効になります。</p>
    `,
  };

  await transport.sendMail(message);
}

export async function login(email: string, password: string) {
  const user = await findByEmail(email);

  if (!user || !user.passwordHash) {
    throw new HttpError(401, "AUTH_FAILED", "登録されていないメールアドレスです");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new HttpError(401, "AUTH_FAILED", "メールアドレスとパスワードが一致しません");
  }

  const payload: JwtPayload = {
    sub: user.id,
  };

  const token = config.jwtExpiresIn
    ? jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn })
    : jwt.sign(payload, config.jwtSecret);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  };
}

export async function register(input: {
  email: string;
  password: string;
}) {
  const existingUser = await findByEmail(input.email);
  if (existingUser) {
    throw new HttpError(400, "VALIDATION_ERROR", "すでに同じメールアドレスのユーザーが存在します");
  }

  try {
    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await createUser({
      email: input.email,
      passwordHash,
    });

    return {
      user,
      isNewUser: true,
    };
  } catch (e: any) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw new HttpError(400, "VALIDATION_ERROR", "このメールアドレスは既に登録されています");
    }

    throw e;
  }
}

export async function getAllUsers() {
  return await findAllUsers();
}

export async function getUserById(id: number) {
  const user = await findByIdUser(id);

  if (!user) {
    throw new HttpError(404, "NOT_FOUND", "user not found");
  }

  return user;
}

export async function removeUser(id: number) {
  try {
    return await deleteUserById(id);
  } catch (e: any) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      throw new HttpError(404, "NOT_FOUND", "user not found");
    }
    throw e;
  }
}
export async function putUserById(
  id: number,
  input: {
    email: string;
  }
) {
  return putUser(id, input);
}


export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("ユーザーが見つかりません");
  }

  if (!user.passwordHash) {
    throw new Error("パスワードが設定されていません");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isMatch) {
    throw new Error("現在のパスワードが違います");
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hash },
  });

  return { message: "パスワードを変更しました" };
}


export async function forgotPassword(email: string) {
  const user = await findByEmail(email);

  if (!user) {
    throw new HttpError(404, "NOT_FOUND", "登録されていないメールアドレスです");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30分後

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: expires,
    },
  });

  if (isSmtpConfigured()) {
    await sendResetPasswordEmail(user.email, resetToken);
    return {
      message: "再設定用の案内を送信しました",
    };
  }

  console.warn(
    "SMTP settings are not configured. Returning reset token in response for development use."
  );

  return {
    message:
      "再設定用の案内を送信しました (SMTP未設定のためトークンを返します)",
    token: resetToken,
  };
}

export async function resetPassword(token: string, password: string) {
  if (String(password).trim().length < 8) {
    throw new HttpError(400, "VALIDATION_ERROR", "パスワードは8文字以上で入力してください");
  }

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
    },
  });

  if (!user) {
    throw new HttpError(400, "INVALID_TOKEN", "再設定URLが無効です");
  }

  if (!user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
    throw new HttpError(400, "INVALID_TOKEN", "再設定URLの有効期限が切れています");
  }

  const passwordHash = await bcrypt.hash(String(password).trim(), 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    },
  });

  return {
    message: "パスワードを再設定しました",
  };
}