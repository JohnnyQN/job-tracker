import db from '../db.js';

// Fetch interview by ID
export const getInterviewById = async (interviewId) => {
    try {
        console.log(`📡 Fetching interview for ID: ${interviewId}`);

        // Ensure the ID is treated as a string
        const result = await db.query("SELECT * FROM interviews WHERE id = $1::TEXT", [interviewId]);

        if (result.rows.length === 0) {
            console.warn("⚠️ No interview found for ID:", interviewId);
            return null;
        }

        return result.rows[0];
    } catch (error) {
        console.error("❌ Error fetching interview from database:", error);
        throw error;
    }
};

// Insert new interview (ensuring job application exists first)
export const insertInterview = async (eventId, applicationId, date, time, notes) => {
    try {
        console.log(`📡 Checking if application_id ${applicationId} exists in job_applications...`);

        // Verify that the job application exists
        const appCheck = await db.query("SELECT id FROM job_applications WHERE id = $1", [applicationId]);

        if (appCheck.rows.length === 0) {
            console.error(`❌ Error: No job application found for application_id ${applicationId}.`);
            throw new Error(`Job application with ID ${applicationId} does not exist.`);
        }

        // Insert the interview
        const result = await db.query(`
            INSERT INTO interviews (id, user_id, application_id, date, time, notes, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *;
        `, [eventId, applicationId, date, time, notes]);

        console.log("✅ Interview stored with Google Calendar ID:", eventId);
        return result.rows[0];
    } catch (error) {
        console.error("❌ Error saving interview:", error);
        throw error;
    }
};

// Fetch all scheduled interviews
export const getScheduledInterviews = async () => {
    try {
        const result = await db.query("SELECT * FROM interviews ORDER BY date ASC, time ASC");

        if (result.rows.length === 0) {
            console.warn("⚠️ No scheduled interviews found.");
            return [];
        }

        console.log("✅ Fetched scheduled interviews:", result.rows);
        return result.rows;
    } catch (error) {
        console.error("❌ Error fetching scheduled interviews:", error);
        throw error;
    }
};
