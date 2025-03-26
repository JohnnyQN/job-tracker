import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import db from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.post('/schedule', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      dateTime, // "2025-03-29T08:30"
      duration,
      location,
      userEmail,
      jobId,
      description
    } = req.body;

    const userId = req.user?.userId;
    if (!title || !dateTime || !duration || !userEmail || !userId || !jobId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // DO NOT manipulate or parse this—assume it's already in user's local time
    const startDateTime = `${dateTime}:00`;
    const endDate = new Date(`${startDateTime}`);
    const endDateTime = new Date(endDate.getTime() + duration * 60000).toISOString().slice(0, 19);

    const timeZone = 'America/Los_Angeles';

    oauth2Client.setCredentials({ access_token: process.env.GOOGLE_ACCESS_TOKEN });
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: title,
      location: location || '',
      start: {
        dateTime: startDateTime,
        timeZone
      },
      end: {
        dateTime: endDateTime,
        timeZone
      },
      attendees: [{ email: userEmail }],
      reminders: { useDefault: true },
      description: description || ''
    };

    const googleResponse = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    const eventId = googleResponse.data.id;

    // Save local datetime parts into DB
    const [dbDate, dbTime] = dateTime.split('T');

    const dbResponse = await db.query(
      `INSERT INTO interviews
        (id, user_id, job_id, date, time, notes, duration, location, userEmail, description, created_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *`,
      [
        eventId,
        userId,
        jobId,
        dbDate,
        `${dbTime}:00`,
        title,
        duration,
        location,
        userEmail,
        description || ''
      ]
    );

    res.json({
      message: 'Interview scheduled successfully',
      event: googleResponse.data,
      interview: dbResponse.rows[0]
    });
  } catch (err) {
    console.error('❌ Error scheduling interview:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to create interview event' });
  }
});

export default router;
