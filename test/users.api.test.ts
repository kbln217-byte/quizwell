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

  it("POST /users should return an existing user when name and email match", async () => {
    const email = `same-user-${Date.now()}@example.com`;

    const firstRes = await request(app)
      .post("/users")
      .send({
        name: "same-user",
        email,
      });

    const secondRes = await request(app)
      .post("/users")
      .send({
        name: "same-user",
        email,
      });

    expect(firstRes.status).toBe(201);
    expect(secondRes.status).toBe(200);
    expect(secondRes.body.user).toBeDefined();
    expect(secondRes.body.user.id).toBe(firstRes.body.user.id);
    expect(secondRes.body.user.email).toBe(email);
  });

  it("POST /users should return 400 when email exists with a different name", async () => {
    const email = `duplicate-email-${Date.now()}@example.com`;

    await request(app)
      .post("/users")
      .send({
        name: "first-user",
        email,
      });

    const res = await request(app)
      .post("/users")
      .send({
        name: "second-user",
        email,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.message).toBe("email already exists");
  });
});
