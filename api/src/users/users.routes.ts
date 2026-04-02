import { Router } from "express";
import * as service from "./users.service";

export const usersRouter = Router();

// 新規作成
usersRouter.post("/", async (req, res, next) => {
  try {
    console.log("users req.headers content-type =", req.headers["content-type"]);
    console.log("users req.body =", req.body);

    const body = (req.body ?? {}) as {
      email?: string;
      password?: string;
    };

    const { email, password } = body;

    if (!email || !password) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "email and password are required",
        },
      });
      return;
    }

    if (String(password).trim().length < 4) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "password must be at least 4 characters",
        },
      });
      return;
    }

    const result = await service.register({
      email: String(email).trim().toLowerCase(),
      password: String(password).trim(),
    });

    res.status(result.isNewUser ? 201 : 200).json({ user: result.user });
  } catch (e) {
    next(e);
  }
});

// 更新
usersRouter.put("/:id", async (req, res, next) => {
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

    const { email, password } = req.body ?? {};

    if (!email || !password) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "email and password are required",
        },
      });
      return;
    }

    const user = await service.putUserById(id, {
      email: String(email).trim(),
    });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

// 削除
usersRouter.delete("/:id", async (req, res, next) => {
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
  } catch (error) {
    next(error);
  }
});

// ログイン
usersRouter.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "email and password are required",
        },
      });
      return;
    }

    const result = await service.login(
      String(email).trim().toLowerCase(),
      String(password).trim()
    );

    res.status(200).json(result);
  } catch (e: any) {
    const status = e?.status || 500;
    res.status(status).json({
      error: {
        code: e?.code || "LOGIN_FAILED",
        message: e?.message ?? "ログインに失敗しました",
      },
    });
  }
});

// パスワード忘れ
usersRouter.post("/auth/forgot-password", async (req, res) => {
  try {
    console.log("DEBUG route forgot-password start");

    const { email } = req.body ?? {};

    if (!email) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "email is required",
        },
      });
      return;
    }

    const result = await service.forgotPassword(
      String(email).trim().toLowerCase()
    );

    console.log("DEBUG route result =", result);
    console.log("DEBUG route before res.json");

    res.status(200).json(result);

    console.log("DEBUG route after res.json");
  } catch (e: any) {
    console.error("DEBUG route catch =", e);

    const status = e?.status || 500;
    res.status(status).json({
      error: {
        code: e?.code || "FORGOT_PASSWORD_FAILED",
        message: e?.message ?? "送信に失敗しました",
      },
    });
  }
});

// メール経由の再設定
usersRouter.post("/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body ?? {};

    if (!token || !password) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "token and password are required",
        },
      });
      return;
    }

    const result = await service.resetPassword(
      String(token),
      String(password).trim()
    );

    res.status(200).json(result);
  } catch (e: any) {
    const status = e?.status || 500;
    res.status(status).json({
      error: {
        code: e?.code || "RESET_PASSWORD_FAILED",
        message: e?.message ?? "パスワード再設定に失敗しました",
      },
    });
  }
});

// ログイン中ユーザーのパスワード変更
usersRouter.post("/me/password", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const userId = service.getUserIdFromAuthHeader(authHeader);

    const body = (req.body ?? {}) as {
      currentPassword?: string;
      newPassword?: string;
    };

    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "currentPassword and newPassword are required",
        },
      });
      return;
    }

    const result = await service.changePassword(
      userId,
      String(currentPassword),
      String(newPassword)
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});