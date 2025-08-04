import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';
import { env } from '../configs/env';

export const dbClient = drizzle({
  connection: {
    connectionString: env.DATABASE_URL,
    ssl: false,
  },
  casing: 'snake_case',
  schema: schema,
});

export type DbClient = typeof dbClient;
