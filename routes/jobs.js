import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Job from '../models/Job.js';

const router = express.Router();

// Get all jobs for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const jobs = await Job.findAll({ where: { user_id: req.user.userId } });
        res.json(jobs);
    } catch (error) {
        console.error("❌ Error fetching jobs:", error);
        res.status(500).json({ error: "Server error while fetching jobs" });
    }
});

// Get a single job by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const job = await Job.findOne({ where: { id: req.params.id, user_id: req.user.userId } });

        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        res.json(job);
    } catch (error) {
        console.error("❌ Error fetching job:", error);
        res.status(500).json({ error: "Server error while fetching job" });
    }
});

// Create a new job
router.post('/', authMiddleware, async (req, res) => {
    // inside your POST /api/jobs
try {
    const newJob = await Job.create({
      ...req.body,
      user_id: req.user.userId,
    });
    console.log("✅ Job created:", newJob); // <-- Add this line for debugging
    res.status(201).json({ job: newJob });
  } catch (error) {
    console.error("❌ Error creating job:", error);
    res.status(500).json({ error: "Server error while creating job" });
  } 
});

// Update an existing job
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job || job.user_id !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized to edit this job' });
        }
        await job.update(req.body);
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a job
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.id);
        if (!job || job.user_id !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this job' });
        }
        await job.destroy();
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
