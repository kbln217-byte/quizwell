"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllSessions = findAllSessions;
exports.findByIdSession = findByIdSession;
const db_1 = require("../db");
async function findAllSessions() {
    return db_1.prisma.examSession.findMany({
        orderBy: { id: "asc" },
    });
}
async function findByIdSession(id) {
    return db_1.prisma.examSession.findUnique({
        where: { id },
    });
}
// export async function listSessions(params: {
//   q?: string;
//   page: number;
//   limit: number;
// }) {
//   const { q, page, limit } = params;
//   const skip = (page - 1) * limit;
//   const where: Prisma.ExamSessionWhereInput = q
//     ? {
//         OR: [
//           { name: { contains: q, mode: "insensitive" } },
//           { email: { contains: q, mode: "insensitive" } },
//         ],
//       }
//     : {};
//   const [items, total] = await Promise.all([
//     prisma.examSession.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: { id: "asc" },
//     }),
//     prisma.examSession.count({ where }),
//   ]);
//   return { items, total };
// }
//# sourceMappingURL=examSessions.repo.js.map