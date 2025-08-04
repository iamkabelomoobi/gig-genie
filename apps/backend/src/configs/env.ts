import { cleanEnv, num, str } from 'envalid';

/**
 * Validated environment configuration with sensible defaults
 */
export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),
  PORT: num({
    desc: 'Port on which the server will run',
    default: 3000,
  }),
  DATABASE_URL: str({
    desc: 'Database connection string',
    default: 'postgres://postgres:root@localhost:5437/gig_genie',
  }),
  DATABASE_POOL_MAX: num({
    desc: 'Maximum number of clients in the database pool',
    default: 20,
  }),
  DATABASE_IDLE_TIMEOUT: num({
    desc: 'How long a client is allowed to remain idle before being closed (ms)',
    default: 30000,
  }),
  DATABASE_CONNECTION_TIMEOUT: num({
    desc: 'How long to wait for a database connection (ms)',
    default: 5000,
  }),
  LogtailAccessToken: str({
    desc: 'Logtail access token for logging',
    default: '',
  }),
});
