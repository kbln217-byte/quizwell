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

export async function login(email: string) {
  const user = await findByEmail(email);

  if (!user) {
    throw new HttpError(401, "AUTH_FAILED", "Invalid email");
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
  name: string;
  email: string;
}) {
  const existingUser = await findByEmail(input.email);
  if (existingUser) {
    if (existingUser.name === input.name) {
      return {
        user: existingUser,
        isNewUser: false,
      };
    }

    throw new HttpError(400, "VALIDATION_ERROR", "email already exists");
  }

  try {
    const user = await createUser({
      name: input.name,
      email: input.email,
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
      throw new HttpError(400, "VALIDATION_ERROR", "email already exists");
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
  try {
    return await putUser(id, input);
  } catch (e: any) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw new HttpError(400, "VALIDATION_ERROR", "email already exists");
    }

    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2025"
    ) {
      throw new HttpError(404, "NOT_FOUND", "user not found");
    }

    throw e;
  }
}
