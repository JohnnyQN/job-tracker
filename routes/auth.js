import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Helper function to validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    return emailRegex.test(email);
};

// ✅ Test Route (No token required)
router.get('/', (req, res) => {
    res.send("✅ Auth route is working");
});

// ✅ Register a new user (No token required)
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error) {
        console.error("❌ Error in registration:", error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// ✅ User Login (No token required)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error("❌ Error in login:", error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

export default router;
