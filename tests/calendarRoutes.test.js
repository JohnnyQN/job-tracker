import request from "supertest";
import app from "../server.js";
import db from "../db.js";

const testUser = {
    name: "Test User",
    email: `testuser_${Date.now()}@example.com`,
    password: "password123"
  };

let token;
let jobId;

beforeAll(async () => {
  await db.query("DELETE FROM interviews");
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);

  await request(app).post("/api/auth/register").send(testUser);
  const loginRes = await request(app).post("/api/auth/login").send({
    email: testUser.email,
    password: testUser.password
  });

  token = loginRes.body.token;

  const jobRes = await request(app)
    .post("/api/jobs")
    .set("Authorization", `Bearer ${token}`)
    .send({
      company: "Meta",
      position: "Frontend Dev",
      status: "applied",
      application_date: "2025-03-25" // ✅ required field
    });

  jobId = jobRes.body.job.id;
});

describe("Calendar Routes", () => {
  test("POST /api/calendar/schedule - should schedule an interview", async () => {
    const res = await request(app)
      .post("/api/calendar/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Technical Interview",
        dateTime: "2025-04-01T09:00",
        duration: 30,
        location: "Zoom",
        userEmail: testUser.email,
        jobId,
        description: "Initial tech screen"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("interview");
  });

  test("POST /api/calendar/schedule - should reject missing fields", async () => {
    const res = await request(app)
      .post("/api/calendar/schedule")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Missing Info",
        jobId
      });

    expect(res.statusCode).toBe(400);
  });
});
