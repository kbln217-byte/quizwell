"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.getAllSessions = getAllSessions;
exports.getSessionById = getSessionById;
const examSessions_repo_1 = require("./examSessions.repo");
class HttpError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
exports.HttpError = HttpError;
async function getAllSessions() {
    return await (0, examSessions_repo_1.findAllSessions)();
}
async function getSessionById(id) {
    const session = await (0, examSessions_repo_1.findByIdSession)(id);
    if (!session) {
        throw new HttpError(404, "NOT_FOUND", "session not found");
    }
    return session;
}
//# sourceMappingURL=examSessions.service.js.map