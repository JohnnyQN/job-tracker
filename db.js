import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ Run schema migrations (for production)
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

// Only run migrations if NOT in test environment
if (process.env.NODE_ENV !== 'test') {
  runMigrations();
}

export default pool;
