// src/middlewares/requestLogger.ts
import type { RequestHandler } from 'express';
import { logger } from '../infrastructure/logger';

export const requestLogger: RequestHandler = (req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const end = process.hrtime.bigint();
        const ms = Number(end - start) / 1_000_000;
        logger.info({
            msg: `${req.method} ${req.originalUrl} ${res.statusCode} ${ms.toFixed(1)} ms`,
            ip: req.ip,
            'user-agent': req.headers['user-agent'],
            'x-request-id': req.headers['x-request-id']
        });
    });
    next();
};
