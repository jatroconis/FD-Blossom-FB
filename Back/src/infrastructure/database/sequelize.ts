import { Sequelize } from 'sequelize';
import { logger } from '../../infrastructure/logger';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME || 'rickmorty',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        dialect: 'postgres',
        logging: false,
        define: {
            underscored: true
        }
    }
);

export async function testDB(): Promise<boolean> {
    try {
        await sequelize.authenticate();
        return true;
    } catch (err) {
        logger.error({ err }, 'DB connection failed');
        return false;
    }
}
