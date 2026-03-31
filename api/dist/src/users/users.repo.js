"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = findByEmail;
exports.createUser = createUser;
exports.findByIdUser = findByIdUser;
exports.listUsers = listUsers;
exports.findAllUsers = findAllUsers;
exports.putUser = putUser;
exports.deleteUserById = deleteUserById;
const db_1 = require("../db");
async function findByEmail(email) {
    return db_1.prisma.user.findUnique({
        where: { email },
    });
}
async function createUser(input) {
    return db_1.prisma.user.create({
        data: input,
    });
}
async function findByIdUser(id) {
    return db_1.prisma.user.findUnique({
        where: { id },
    });
}
async function listUsers(params) {
    const { q, page, limit } = params;
    const skip = (page - 1) * limit;
    const where = q
        ? {
            OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
            ],
        }
        : {};
    const [items, total] = await Promise.all([
        db_1.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { id: "asc" },
        }),
        db_1.prisma.user.count({ where }),
    ]);
    return { items, total };
}
async function findAllUsers() {
    return db_1.prisma.user.findMany({
        orderBy: { id: "asc" },
    });
}
async function putUser(id, input) {
    return db_1.prisma.user.update({
        where: { id },
        data: input,
    });
}
async function deleteUserById(id) {
    return db_1.prisma.user.delete({
        where: { id },
    });
}
//# sourceMappingURL=users.repo.js.map