import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("answers API", () => {
  it("POST /answers should return 404 when user does not exist", async () => {
    const res = await request(app)
      .post("/answers")
      .send({
        userId: 999999,
        questionId: 1,
        selectedChoiceId: 2,
      });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error.message).toBe("user not found");
  });

  it("POST /answers should return 400 when userId is invalid", async () => {
    const res = await request(app)
      .post("/answers")
      .send({
        userId: 0,
        questionId: 1,
        selectedChoiceId: 2,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});