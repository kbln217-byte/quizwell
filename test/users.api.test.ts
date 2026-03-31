import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("users API", () => {
  it("POST /users should create a user", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: `test-${Date.now()}@example.com`,
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toContain("@example.com");
  });

  it("POST /users should return 400 when email is missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        password: "password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /users should return 400 when password is missing", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: `test-${Date.now()}@example.com`,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /users should return 400 when email already exists", async () => {
    const email = `duplicate-email-${Date.now()}@example.com`;

    await request(app)
      .post("/users")
      .send({
        email,
        password: "password123",
      });

    const res = await request(app)
      .post("/users")
      .send({
        email,
        password: "password123",
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.message).toBe("email already exists");
  });
});
