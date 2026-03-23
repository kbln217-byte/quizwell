import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("review API", () => {
  it("GET /review/wrong-questions returns 400 when userId is invalid", async () => {
    const res = await request(app).get("/review/wrong-questions?userId=0");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.message).toBe("userId must be a positive integer");
  });

  it("GET /review/wrong-questions returns 404 when user does not exist", async () => {
    const res = await request(app).get("/review/wrong-questions?userId=999999");

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error.message).toBe("user not found");
  });

  it("GET /review/next returns 400 when userId is invalid", async () => {
    const res = await request(app).get("/review/next?userId=0");

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.message).toBe("userId must be a positive integer");
  });

  it("GET /review/next returns 404 when user does not exist", async () => {
    const res = await request(app).get("/review/next?userId=999999");

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error.message).toBe("user not found");
  });

  it("GET /review/wrong-questions returns 200 when user exists", async () => {
    const res = await request(app).get("/review/wrong-questions?userId=2");

    expect(res.status).toBe(200);
    expect(res.body.items).toBeDefined();
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("GET /review/next returns 200 when user exists", async () => {
    const res = await request(app).get("/review/next?userId=2");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("item");
  });
});

it("GET /review/count returns 400 when userId is invalid", async () => {
  const res = await request(app).get("/review/count?userId=0");

  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe("VALIDATION_ERROR");
});

it("GET /review/count returns 404 when user does not exist", async () => {
  const res = await request(app).get("/review/count?userId=999999");

  expect(res.status).toBe(404);
  expect(res.body.error.code).toBe("NOT_FOUND");
});

it("GET /review/count returns 200 and count", async () => {
  const res = await request(app).get("/review/count?userId=2");

  expect(res.status).toBe(200);
  expect(typeof res.body.count).toBe("number");
});