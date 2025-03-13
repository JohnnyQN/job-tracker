import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Run migrations on startup
const runMigrations = async () => {
    try {
        const schemaPath = path.join(process.cwd(), 'migrations/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schema);
        console.log('✅ Database migrated successfully');
    } catch (error) {
        console.error('❌ Migration error:', error);
    }
};

runMigrations();

export default pool;
