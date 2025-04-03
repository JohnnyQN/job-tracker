import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all jobs for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({ error: "Server error while fetching jobs" });
  }
});

// Get a single job by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching job:", error);
    res.status(500).json({ error: "Server error while fetching job" });
  }
});

// Create a new job
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { company, position, status, notes, date_applied } = req.body;
    const result = await pool.query(
      `INSERT INTO jobs (user_id, company, position, status, notes, date_applied)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.userId, company, position, status, notes, date_applied]
    );

    console.log("✅ Job created:", result.rows[0]);
    res.status(201).json({ job: result.rows[0] });
  } catch (error) {
    console.error("❌ Error creating job:", error);
    res.status(500).json({ error: "Server error while creating job" });
  }
});

// Update an existing job
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { company, position, status, notes, date_applied } = req.body;

    const result = await pool.query(
      `UPDATE jobs
       SET company = $1, position = $2, status = $3, notes = $4, date_applied = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [company, position, status, notes, date_applied, req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to edit this job' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Error updating job:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to delete this job' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
