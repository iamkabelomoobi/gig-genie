import { defineConfig } from 'drizzle-kit';
import { env } from './src/configs/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schemas',
  out: './src/db/migrations',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: true,
  },
  migrations: {
    schema: 'gig_ginie',
    table: 'drizzle_migrations',
  },
});
