import dotenv from "dotenv";
dotenv.config();

import type { SignOptions, Secret } from "jsonwebtoken";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),

  jwtSecret: mustGet("JWT_SECRET") as Secret,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"],

  frontendBaseUrl: mustGet("FRONTEND_BASE_URL"),

  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 0),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from: process.env.SMTP_FROM ?? "",
  },
};