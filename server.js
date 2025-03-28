import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import interviewRoutes from './routes/interviews.js';
import calendarRoutes from './routes/calendar.js';
import db from './db.js';

dotenv.config();
const app = express();

// ✅ CORS Setup - Allow both local and deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://job-tracker-frontend.onrender.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Express Middleware
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("📡 Received request:", req.method, req.url);
  next();
});

// ✅ Debug Logs
console.log("✅ Server is starting...");
console.log("✅ Auth routes loaded:", !!authRoutes);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/calendar', calendarRoutes);

// ✅ Health Check
app.get('/', (req, res) => {
  res.send("🚀 Job Tracker API is running!");
});

// ✅ Server Startup & DB Connection
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`✅ Server running on port ${PORT}`);
    try {
      await db.connect();
      console.log('✅ Connected to PostgreSQL');
    } catch (error) {
      console.error('❌ Database connection error:', error);
    }
  });
}

export default app;
