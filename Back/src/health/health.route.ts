import { Router } from 'express';

const router = Router();

// endpoint REST de salud
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

export default router;
