import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../src/app";

describe("app", () => {
  it("GET / should return hello", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toBe("hello");
  });
});