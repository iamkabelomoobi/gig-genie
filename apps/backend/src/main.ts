import dotenv from 'dotenv';
import { cleanEnv, num } from 'envalid';
import { startServer } from './utils/start-apollo-server.util';

dotenv.config();

const env = cleanEnv(dotenv.config().parsed || process.env, {
  PORT: num({ default: 3000 }),
  RATE_LIMIT_WINDOW_MS: num({ default: 60 * 1000 }),
  RATE_LIMIT_MAX_REQUESTS: num({ default: 60 }),
});

startServer({
  port: env.PORT,
  enableClusterMode: true,
  rateLimitOptions: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
  },
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
