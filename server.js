import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import interviewRoutes from './routes/interviews.js';
import db from './db.js';

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log("📡 Received request:", req.method, req.url);
    next();
});

// ✅ Debugging Logs
console.log("✅ Server is starting...");
console.log("✅ Auth routes loaded:", !!authRoutes);

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interviews', interviewRoutes);

// ✅ Health Check Route
app.get('/', (req, res) => {
    res.send("🚀 Job Tracker API is running!");
});

// ✅ Server Setup & Database Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`✅ Server running on port ${PORT}`);
    try {
        await db.connect();
        console.log('✅ Connected to PostgreSQL');
    } catch (error) {
        console.error('❌ Database connection error:', error);
    }
});

export default app;
