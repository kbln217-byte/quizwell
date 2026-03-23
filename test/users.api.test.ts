import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("users API", () => {
  it("POST /users should create a user", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        name: "test-user",
        email: `test-${Date.now()}@example.com`,
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.name).toBe("test-user");
    expect(res.body.user.email).toContain("@example.com");
  });

  it("POST /users should return 400 when name is missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: "test@example.com",
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });
});