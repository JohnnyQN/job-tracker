-- Drop all existing tables in reverse dependency order
DROP TABLE IF EXISTS reminders CASCADE;
DROP TABLE IF EXISTS interviews CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs Table (used for direct job tracking)
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected')) DEFAULT 'Applied',
    notes TEXT,
    date_applied DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications Table (for more detailed application tracking)
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Applied', 'Interview', 'Offer', 'Rejected')) DEFAULT 'Applied',
    notes TEXT,
    date_applied DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews Table
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES job_applications(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    title VARCHAR(255),
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER,
    location VARCHAR(255),
    userEmail VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reminders Table
CREATE TABLE reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interview_id INTEGER REFERENCES interviews(id) ON DELETE CASCADE,
    reminder_date TIMESTAMP NOT NULL,
    status BOOLEAN DEFAULT FALSE
);
