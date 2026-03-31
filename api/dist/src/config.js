"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function mustGet(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`ENV NULL is required`);
    return v;
}
exports.config = {
    port: Number(process.env.PORT ?? 3006),
    jwtSecret: mustGet("JWT_SECRET"),
    jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? "1h"),
};
//# sourceMappingURL=config.js.map