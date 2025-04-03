import request from "supertest";
import app from "../server.js";
import db from "../db.js";

const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`,
    password: "password123"
  };

let token;

beforeAll(async () => {
  await db.query("DELETE FROM interviews");
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);

  await request(app).post("/api/auth/register").send(testUser);
  const res = await request(app).post("/api/auth/login").send({
    email: testUser.email,
    password: testUser.password
  });
  token = res.body.token;
});

describe("Job Routes", () => {
  test("POST /api/jobs - should create a job", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        company: "Google",
        position: "Software Engineer",
        status: "Applied",
        application_date: "2025-03-25" // ✅ required field
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.job).toHaveProperty("id");
  });

  test("GET /api/jobs - should get all jobs for user", async () => {
    const res = await request(app)
      .get("/api/jobs")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
afterAll(async () => {
  await db.end();
});
