import dotenv from "dotenv";
dotenv.config();

import type { SignOptions, Secret } from "jsonwebtoken";

function mustGet(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`ENV NULL is required`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 3006),
  jwtSecret: mustGet("JWT_SECRET") as Secret,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"],
  frontendBaseUrl: process.env.FRONTEND_BASE_URL ?? "http://localhost:5173",
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 0),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASSWORD ?? "",
    from: process.env.EMAIL_FROM ?? "no-reply@example.com",
  },
};
