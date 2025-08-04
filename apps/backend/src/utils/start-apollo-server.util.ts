import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import express from 'express';
import cors from 'cors';
import http from 'http';
import ip from 'ip';
import os from 'os';
import cluster from 'cluster';
import { dbClient } from '../db/client';
import { handleServerError, setupGracefulShutdown, logger } from '../utils';
import { env } from '../configs/env';
import { ServerOptions } from '../interfaces';

import { typeDefs } from '../graphql/schemas';
import { resolvers } from '../graphql/resolvers';

export const startServer = async (
  options: ServerOptions = {}
): Promise<http.Server> => {
  const {
    port = env.PORT,
    enableClusterMode = false,
    rateLimitOptions = {
      windowMs: 15 * 60 * 1000,
      max: 100,
    },
  } = options;

  const isProduction = env.NODE_ENV === 'production';
  if (enableClusterMode && isProduction && cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    logger.info(`Master ${process.pid} is running with ${numCPUs} workers`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
      logger.warn(
        `Worker ${worker.process.pid} died with code ${code} and signal ${signal}`
      );
      logger.info('Starting a new worker');
      cluster.fork();
    });

    return http.createServer((req, res) => {
      res.writeHead(500);
      res.end('Requests should be handled by worker processes');
    });
  }

  try {
    if (
      dbClient &&
      dbClient.$client &&
      typeof dbClient.$client.query === 'function'
    ) {
      await dbClient.$client.query('SELECT 1');
    }
    logger.info('Database connection established successfully');

    const app = express();

    if (rateLimitOptions) {
      const { default: rateLimit } = await import('express-rate-limit');
      app.use(
        rateLimit({
          windowMs: rateLimitOptions.windowMs,
          max: rateLimitOptions.max,
          message: 'Too many requests from this IP, please try again later',
        })
      );
    }

    const apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start Apollo Server
    await apolloServer.start();

    // Read allowed origins from environment variable, fallback to localhost
    const allowedOrigins = process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:3000'];

    app.use(
      '/graphql',
      cors<cors.CorsRequest>({
        origin: allowedOrigins,
        credentials: true,
      }),
      express.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req, res }) => ({ req, res }),
      })
    );

    const server = http.createServer(app);

    return new Promise<http.Server>((resolve, reject) => {
      server.listen(port, () => {
        const host = `http://${ip.address()}:${port}/graphql`;
        logger.info('GraphQL Server started successfully', {
          host,
          platform: os.platform(),
          pid: process.pid,
          environment: env.NODE_ENV,
          clusterWorker:
            enableClusterMode && isProduction && !cluster.isPrimary,
        });

        setupGracefulShutdown(server);

        resolve(server);
      });

      server.on('error', (error: NodeJS.ErrnoException) => {
        handleServerError(error, port);
        reject(error);
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
      environment: env.NODE_ENV,
    });
    process.exit(1);
  }
};
