import { Router } from 'express';
import { testDB } from '../infrastructure/database/sequelize';
import { pingRedis } from '../infrastructure/cache/redisClient';

const router = Router();

router.get('/health', async (_req, res) => {
    const [db, redis] = await Promise.all([testDB(), pingRedis()]);
    res.json({ status: 'ok', db, redis });
});

export default router;
