import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'job_tracker',
    process.env.DB_USER || 'johnny',
    process.env.DB_PASSWORD || 'Springboard2024$!',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

export default sequelize;
