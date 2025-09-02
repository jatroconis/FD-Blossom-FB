// src/server.ts
import { env } from './config/env';
import { buildApp } from './app';
import { logger } from './infrastructure/logger';

import http from 'http';
import express from 'express';
import cors, { CorsOptions } from 'cors';
import crypto from 'node:crypto';

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import type { ExpressContextFunctionArgument } from '@as-integrations/express5';

import { typeDefs, resolvers } from './modules/character/presentation/graphql';
import { setupCron } from './infrastructure/scheduler/cron';

interface GraphQLContext {
    requestId: string | null;
}

const bootstrap = async () => {
    const app = buildApp();
    const httpServer = http.createServer(app);


    const corsOptions: CorsOptions = {
        origin: (process.env.CORS_ORIGINS ?? '*').split(',').map(o => o.trim()),
        credentials: false
    };

    const apollo = new ApolloServer<GraphQLContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        // Solo exposición en dev
        introspection: env.nodeEnv !== 'production'
    });
    await apollo.start();

    // encapsulacionn de el middleware
    const gqlMiddleware = expressMiddleware(apollo, {
        context: async ({ req }: ExpressContextFunctionArgument): Promise<GraphQLContext> => {
            let requestId = (req.headers['x-request-id'] as string) ?? null;
            if (!requestId) requestId = crypto.randomUUID();
            return { requestId };
        }
    }) as unknown as express.RequestHandler;

    app.use('/graphql',
        cors(corsOptions),
        express.json({ limit: '1mb' }),
        gqlMiddleware
    );

    // ---- Cron (sync cada [hora configuradaa en el env] según .env) ----
    setupCron();

    httpServer.listen(env.port, () => {
        logger.info(`HTTP listening on http://localhost:${env.port}`);
        logger.info(`GraphQL at http://localhost:${env.port}/graphql`);
    });

    const shutdown = (signal: string) => {
        logger.info({ msg: `Received ${signal}, shutting down...` });
        httpServer.close(err => {
            if (err) {
                logger.error({ err }, 'Error on httpServer.close');
                process.exit(1);
            }
            process.exit(0);
        });
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
};

bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
});
