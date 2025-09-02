import { createClient } from 'redis';
import dotenv from 'dotenv';
import { logger } from '../logger';
dotenv.config();

const url = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = createClient({ url });

redis.on('error', (err) => logger.error({ err }, 'Redis error'));
redis.on('connect', () => logger.info('Redis connecting...'));
redis.on('ready', () => logger.info('Redis ready'));

export async function connectRedis() {
    if (!redis.isOpen) await redis.connect();
    return redis;
}

export async function pingRedis(): Promise<boolean> {
    try {
        await connectRedis();
        const pong = await redis.ping();
        return pong === 'PONG';
    } catch {
        return false;
    }
}
