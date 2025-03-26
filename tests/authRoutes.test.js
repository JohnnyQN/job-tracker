import request from "supertest";
import app from "../server.js";
import db from "../db.js";

const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`, 
    password: "password123"
  };

beforeAll(async () => {
  await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);
});

describe("Auth Routes", () => {
  test("POST /api/auth/register - should register new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/auth/login - should login existing user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/auth/login - should reject invalid login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "fake@example.com",
      password: "wrongpassword"
    });
    expect(res.statusCode).toBe(401);
  });
});
