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
exports.usersRouter = void 0;
const express_1 = require("express");
const service = __importStar(require("./users.service"));
exports.usersRouter = (0, express_1.Router)();
// 新規作成
exports.usersRouter.post("/", async (req, res, next) => {
    try {
        console.log("users req.headers content-type =", req.headers["content-type"]);
        console.log("users req.body =", req.body);
        const body = (req.body ?? {});
        const { name, email } = body;
        if (!name || !email) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "name and email are required",
                },
            });
            return;
        }
        const result = await service.register({
            name: name.trim(),
            email: email.trim().toLowerCase(),
        });
        res.status(result.isNewUser ? 201 : 200).json({ user: result.user });
    }
    catch (e) {
        next(e);
    }
});
// 一覧取得
exports.usersRouter.get("/", async (req, res, next) => {
    try {
        const users = await service.getAllUsers();
        res.status(200).json({ users });
    }
    catch (error) {
        next(error);
    }
});
// 詳細取得
exports.usersRouter.get("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "id must be a positive integer",
                },
            });
            return;
        }
        const user = await service.getUserById(id);
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
// 更新
exports.usersRouter.put("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "id must be a positive integer",
                },
            });
            return;
        }
        const { name, email } = req.body ?? {};
        if (!name || !email) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "name and email are required",
                },
            });
            return;
        }
        const user = await service.putUserById(id, {
            name: String(name).trim(),
            email: String(email).trim(),
        });
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
});
// 削除
exports.usersRouter.delete("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "id must be a positive integer",
                },
            });
            return;
        }
        await service.removeUser(id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=users.routes.js.map