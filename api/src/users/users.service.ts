import * as jwt from "jsonwebtoken";
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

export async function login(email: string, password: string) {
  const user = await findByEmail(email);

  if (
    !user ||
    !user.passwordHash ||
    !(await bcrypt.compare(password, user.passwordHash))
  ) {
    throw new HttpError(401, "AUTH_FAILED", "ユーザーが見つかりません");
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
      name: user.name,
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
    const name = input.email.split("@")[0] || input.email;

    const user = await createUser({
      name,
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
    name: string;
    email: string;
  }
) {
  return putUser(id, input);
}
