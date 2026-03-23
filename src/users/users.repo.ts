import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(input: {
  name: string;
  email: string;
}) {
  return prisma.user.create({
    data: input,
  });
}

export async function findByIdUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
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
          { name: { contains: q, mode: "insensitive" } },
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
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

export async function findAllUsers() {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
  });
}

export async function putUser(
  id: number,
  input: {
    name: string;
    email: string;
  }
) {
  return prisma.user.update({
    where: { id },
    data: input,
  });
}

export async function deleteUserById(id: number) {
  return prisma.user.delete({
    where: { id },
  });
}