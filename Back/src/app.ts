import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLogger } from './middlewares/requestLogger';
import healthRoute from './health/health.route';
import { setupSwagger } from './infrastructure/docs/swagger';
import charactersRoute from './modules/character/presentation/rest/characters.route';
export const buildApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(requestLogger);

    // Rutas REST
    app.use('/api', healthRoute);
    app.use('/api/characters', charactersRoute);

    // Swagger UI
    setupSwagger(app);

    return app;
};
