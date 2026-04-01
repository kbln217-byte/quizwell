import { Prisma } from "@prisma/client";
import { prisma } from "../db";

const publicUserSelect = {
  id: true,
  email: true,
} satisfies Prisma.UserSelect;

export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      resetPasswordToken: true,
      resetPasswordExpiresAt: true,
    },
  });
}

export async function createUser(input: {
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: input,
    select: publicUserSelect,
  });
}

export async function findByIdUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
}

export async function listUsers(params: {
  q?: string;
  page: number;
  limit: number;
}) {
  const { q, page, limit } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = q
    ? {
        OR: [
          { email: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "asc" },
      select: publicUserSelect,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

export async function findAllUsers() {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
    select: publicUserSelect,
  });
}

export async function putUser(
  id: number,
  input: {
    email: string;
  }
) {
  return prisma.user.update({
    where: { id },
    data: {
      email: input.email,
    },
    select: publicUserSelect,
  });
}

export async function deleteUserById(id: number) {
  return prisma.user.delete({
    where: { id },
    select: publicUserSelect,
  });
}

export async function saveResetPasswordToken(
  userId: number,
  token: string,
  expires: Date
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      resetPasswordToken: token,
      resetPasswordExpiresAt: expires,
    },
    select: publicUserSelect,
  });
}

export async function findByResetPasswordToken(token: string) {
  return prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
    },
    select: {
      id: true,
      email: true,
      resetPasswordToken: true,
      resetPasswordExpiresAt: true,
      passwordHash: true,
    },
  });
}

export async function updatePasswordAndClearResetToken(
  userId: number,
  passwordHash: string
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpiresAt: null,
    },
    select: publicUserSelect,
  });
}