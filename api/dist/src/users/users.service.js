"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
exports.login = login;
exports.register = register;
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.removeUser = removeUser;
exports.putUserById = putUserById;
const jwt = __importStar(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const users_repo_1 = require("./users.repo");
class HttpError extends Error {
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
    }
}
exports.HttpError = HttpError;
async function login(email) {
    const user = await (0, users_repo_1.findByEmail)(email);
    if (!user) {
        throw new HttpError(401, "AUTH_FAILED", "Invalid email");
    }
    const payload = {
        sub: user.id,
    };
    const token = config_1.config.jwtExpiresIn
        ? jwt.sign(payload, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn })
        : jwt.sign(payload, config_1.config.jwtSecret);
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}
async function register(input) {
    const existingUser = await (0, users_repo_1.findByEmail)(input.email);
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
        const user = await (0, users_repo_1.createUser)({
            name: input.name,
            email: input.email,
        });
        return {
            user,
            isNewUser: true,
        };
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002") {
            throw new HttpError(400, "VALIDATION_ERROR", "email already exists");
        }
        throw e;
    }
}
async function getAllUsers() {
    return await (0, users_repo_1.findAllUsers)();
}
async function getUserById(id) {
    const user = await (0, users_repo_1.findByIdUser)(id);
    if (!user) {
        throw new HttpError(404, "NOT_FOUND", "user not found");
    }
    return user;
}
async function removeUser(id) {
    try {
        return await (0, users_repo_1.deleteUserById)(id);
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            e.code === "P2025") {
            throw new HttpError(404, "NOT_FOUND", "user not found");
        }
        throw e;
    }
}
async function putUserById(id, input) {
    try {
        return await (0, users_repo_1.putUser)(id, input);
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            e.code === "P2002") {
            throw new HttpError(400, "VALIDATION_ERROR", "email already exists");
        }
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            e.code === "P2025") {
            throw new HttpError(404, "NOT_FOUND", "user not found");
        }
        throw e;
    }
}
//# sourceMappingURL=users.service.js.map