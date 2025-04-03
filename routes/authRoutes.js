import express from "express";
import dotenv from "dotenv";
import { google } from "googleapis";
import session from "express-session";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import db from "../db.js";

dotenv.config();
const router = express.Router();

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Google OAuth Login Route
router.get("/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/calendar.events"
    ],
  });
  res.redirect(authUrl);
});

// OAuth Callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Check if the user exists in the database by email
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [data.email]);
    let user;
    if (userResult.rows.length > 0) {
      user = userResult.rows[0];
    } else {
      // If user doesn't exist, create a new user with a default password (or generate a random one)
      const defaultPassword = "defaultpassword"; // Replace with your logic or generate a secure random string
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      const newUserResult = await db.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
        [data.name, data.email, hashedPassword]
      );
      user = newUserResult.rows[0];
    }

    // Generate a JWT token that includes the userId, email, and name
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("http://localhost:3000/dashboard");
  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).send("Authentication Failed");
  }
});

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
