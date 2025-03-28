import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get all jobs for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE user_id = $1 ORDER BY application_date DESC',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error while fetching jobs' });
  }
});

// ✅ Get a single job by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error fetching job:', error);
    res.status(500).json({ error: 'Server error while fetching job' });
  }
});

// ✅ Create a new job
router.post('/', authMiddleware, async (req, res) => {
  const { company, position, status, application_date, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO jobs (user_id, company, position, status, application_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.userId, company, position, status, application_date, notes]
    );

    console.log('✅ Job created:', result.rows[0]);
    res.status(201).json({ job: result.rows[0] });
  } catch (error) {
    console.error('❌ Error creating job:', error);
    res.status(500).json({ error: 'Server error while creating job' });
  }
});

// ✅ Update an existing job
router.put('/:id', authMiddleware, async (req, res) => {
  const { company, position, status, application_date, notes } = req.body;

  try {
    // Check ownership
    const existing = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (existing.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to edit this job' });
    }

    const result = await pool.query(
      `UPDATE jobs
       SET company = $1, position = $2, status = $3, application_date = $4, notes = $5
       WHERE id = $6
       RETURNING *`,
      [company, position, status, application_date, notes, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Error updating job:', error);
    res.status(500).json({ error: 'Server error while updating job' });
  }
});

// ✅ Delete a job
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check ownership
    const existing = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (existing.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to delete this job' });
    }

    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting job:', error);
    res.status(500).json({ error: 'Server error while deleting job' });
  }
});

export default router;
