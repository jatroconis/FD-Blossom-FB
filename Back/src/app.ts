import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middlewares/requestLogger';
import healthRoute from './health/health.route';
import charactersRoute from './modules/character/presentation/rest/characters.route';

export const buildApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(requestLogger);

    app.use('/api', healthRoute);
    app.use('/api/characters', charactersRoute);
    return app;
};
