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
      email: email.trim().toLowerCase(),
      password: String(password).trim(),
    });

    res.status(result.isNewUser ? 201 : 200).json({ user: result.user });
  } catch (e) {
    next(e);
  }
});

// 一覧取得
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await service.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
});

// 詳細取得
usersRouter.get("/:id", async (req, res, next) => {
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
  } catch (error) {
    next(error);
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
