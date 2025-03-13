import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import db from '../db.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// 🔒 Secure all job routes
router.use(authMiddleware);

// ✅ Create a new job application (Token Required)
router.post('/', async (req, res) => {
    const { company, position, status, application_date, notes } = req.body;
    const userId = req.user.userId;

    try {
        const newJob = await db.query(
            'INSERT INTO jobs (user_id, company, position, status, application_date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [userId, company, position, status, application_date, notes]
        );
        res.status(201).json(newJob.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error creating job entry' });
    }
});

// ✅ Get all jobs for the logged-in user (Token Required)
router.get('/', async (req, res) => {
    const userId = req.user.userId;

    try {
        const jobs = await db.query('SELECT * FROM jobs WHERE user_id = $1 ORDER BY application_date DESC', [userId]);
        res.json(jobs.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching jobs' });
    }
});

// ✅ Get a specific job (Only if it belongs to the user)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const job = await db.query('SELECT * FROM jobs WHERE id = $1 AND user_id = $2', [id, userId]);
        if (job.rows.length === 0) return res.status(404).json({ error: 'Job not found' });
        res.json(job.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching job details' });
    }
});

// ✅ Update a job (Only if it belongs to the user)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { company, position, status, application_date, notes } = req.body;
    const userId = req.user.userId;

    try {
        const result = await db.query(
            'UPDATE jobs SET company = $1, position = $2, status = $3, application_date = $4, notes = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
            [company, position, status, application_date, notes, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found or unauthorized' });
        }

        res.json({ message: 'Job updated successfully', job: result.rows[0] });
    } catch (error) {
        console.error('❌ Update error:', error);
        res.status(500).json({ error: 'Server error while updating job' });
    }
});

// ✅ Delete a job (Only if it belongs to the user)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const result = await db.query('DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Job not found or unauthorized' });
        }

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting job entry' });
    }
});

export default router;
