import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { env } from '../configs/env';

async function main() {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    await client.query('BEGIN');
    try {
      await client.query('DROP TABLE IF EXISTS "Admins" CASCADE');
      await client.query('DROP TABLE IF EXISTS "Applications" CASCADE');
      await client.query('DROP TABLE IF EXISTS "Candidates" CASCADE');
      await client.query('DROP TABLE IF EXISTS "Employers" CASCADE');
      await client.query('DROP TABLE IF EXISTS "Jobs" CASCADE');
      await client.query('DROP TABLE IF EXISTS "Resumes" CASCADE');
      await client.query('DROP TABLE IF EXISTS "Users" CASCADE');

      await client.query('DROP TYPE IF EXISTS "admin_type" CASCADE');
      await client.query('DROP TYPE IF EXISTS "application_status" CASCADE');
      await client.query('DROP TYPE IF EXISTS "job_type" CASCADE');
      await client.query('DROP TYPE IF EXISTS "user_role" CASCADE');

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error cleaning up database:', error);
    throw error;
  }

  const db = drizzle(pool);

  console.log('Running migrations...');

  await migrate(db, { migrationsFolder: 'drizzle' });

  console.log('Migrations completed successfully');

  await pool.end();
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
