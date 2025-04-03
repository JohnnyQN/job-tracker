import express from 'express';
import dotenv from 'dotenv';
import db from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

/**
 * POST /api/calendar/schedule
 * Save interview info in the DB (no Google Calendar integration)
 */
router.post('/schedule', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      dateTime,  
      duration,
      location,
      userEmail,
      jobId,
      description
    } = req.body;

    const userId = req.user?.userId;

    if (!title || !dateTime || !duration || !userEmail || !userId || !jobId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [dateStr, timeStr] = dateTime.split('T'); 
    const timeWithSeconds = `${timeStr}:00`; 

    const result = await db.query(
      `INSERT INTO interviews
         (user_id, job_id, date, time, title, duration, location, userEmail, description, created_at)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [
        userId,
        jobId,
        dateStr,
        timeWithSeconds,
        title,
        duration,
        location,
        userEmail,
        description || ''
      ]
    );

    res.json({ message: "Interview scheduled", interview: result.rows[0] });
  } catch (err) {
    console.error("❌ Failed to schedule interview:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET /api/calendar/scheduled
 * Return all interviews for the logged-in user
 */
router.get('/scheduled', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized - no user" });

    const dbResponse = await db.query(
      `SELECT * FROM interviews
        WHERE user_id = $1
        ORDER BY date ASC, time ASC`,
      [userId]
    );

    res.json(dbResponse.rows);
  } catch (err) {
    console.error("❌ Error fetching scheduled interviews:", err);
    res.status(500).json({ error: "Failed to fetch scheduled interviews" });
  }
});

/**
 * GET /api/calendar/interview/:id
 * Return one interview
 */
router.get('/interview/:id', authMiddleware, async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user?.userId;

    const result = await db.query(
      `SELECT * FROM interviews
        WHERE id = $1 AND user_id = $2`,
      [interviewId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Interview not found or not yours' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error fetching interview:", err);
    res.status(500).json({ error: "Server error fetching interview" });
  }
});

/**
 * PUT /api/calendar/interview/:id
 * Update an interview
 */
router.put('/interview/:id', authMiddleware, async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user?.userId;
    const { title, dateTime, duration, location, userEmail, description } = req.body;

    if (!title || !dateTime || !duration || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [dateStr, timeStr] = dateTime.split('T');
    const timeWithSeconds = `${timeStr}:00`;

    const result = await db.query(
      `UPDATE interviews SET 
        title = $1,
        date = $2,
        time = $3,
        duration = $4,
        location = $5,
        userEmail = $6,
        description = $7
      WHERE id = $8 AND user_id = $9
      RETURNING *`,
      [title, dateStr, timeWithSeconds, duration, location, userEmail, description, interviewId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Interview not found or not authorized" });
    }

    res.json({ message: "Interview updated", interview: result.rows[0] });
  } catch (error) {
    console.error("❌ Error updating interview:", error);
    res.status(500).json({ error: "Failed to update interview" });
  }
});

/**
 * DELETE /api/calendar/cancel/:eventId
 * Cancel (delete) interview from the DB
 */
router.delete('/cancel/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user?.userId;

    const result = await db.query(
      `SELECT * FROM interviews WHERE id = $1 AND user_id = $2`,
      [eventId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: "No such interview or not yours" });
    }

    await db.query(`DELETE FROM interviews WHERE id = $1`, [eventId]);

    res.json({ message: "Interview canceled successfully" });
  } catch (err) {
    console.error("❌ Error canceling interview:", err);
    res.status(500).json({ error: "Failed to cancel interview" });
  }
});

export default router;
