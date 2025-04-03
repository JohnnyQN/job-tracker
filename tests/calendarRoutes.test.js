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

  const registerRes = await request(app).post("/api/auth/register").send(testUser);
  if (registerRes.statusCode !== 201) {
    console.error("❌ Registration failed:", registerRes.statusCode, registerRes.body);
    throw new Error("Registration failed");
  }

  const loginRes = await request(app).post("/api/auth/login").send({
    email: testUser.email,
    password: testUser.password
  });

  console.log("🔑 Login Response:", loginRes.statusCode, loginRes.body);

  token = loginRes.body.token;
  if (!token) {
    console.error("❌ Failed to get token");
    throw new Error("Login failed");
  }

  const jobRes = await request(app)
    .post("/api/jobs")
    .set("Authorization", `Bearer ${token}`)
    .send({
      company: "Meta",
      position: "Frontend Dev",
      status: "Applied",
      application_date: "2025-03-25"
    });

  jobId = jobRes.body.job?.id;
  if (!jobId) {
    console.error("❌ Failed to create job:", jobRes.body);
    throw new Error("Job creation failed");
  }
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
afterAll(async () => {
  await db.end();
});
