import * as argon2 from 'argon2';
import { DbClient } from './client';
import { admins, candidates, employers, users } from './schemas';
import { UserRole, AdminType } from '@gig-genie/shared';

export const runSeed = async (db: DbClient) => {
  const existing_users = await db.select().from(users);

  try {
    if (existing_users.length === 0) {
      async function seed() {
        // Seed Users
        const userData = [
          {
            email: 'admin@giggenie.com',
            phone: '1234567890',
            password: await argon2.hash('adminpass'),
            role: UserRole.ADMIN,
            isVerified: true,
          },
          {
            email: 'candidate@giggenie.com',
            phone: '2345678901',
            password: await argon2.hash('candidatepass'),
            role: UserRole.CANDIDATE,
            isVerified: true,
          },
          {
            email: 'employer@giggenie.com',
            phone: '3456789012',
            password: await argon2.hash('employerpass'),
            role: UserRole.EMPLOYER,
            isVerified: true,
          },
        ];

        const insertedUsers = await db
          .insert(users)
          .values(userData)
          .returning();

        // Seed Admins
        await db.insert(admins).values({
          firstName: 'Admin',
          lastName: 'User',
          type: AdminType.MODERATOR,
          userId: insertedUsers[0].id,
        });

        // Seed Candidates
        await db.insert(candidates).values({
          firstName: 'Candidate',
          lastName: 'User',
          title: 'Software Engineer',
          skills: 'TypeScript,React',
          userId: insertedUsers[1].id,
        });

        // Seed Employers
        await db.insert(employers).values({
          companyName: 'Tech Corp',
          slug: 'tech-corp',
          industry: 'Software',
          websiteUrl: 'https://techcorp.com',
          location: 'Remote',
          description: 'A leading tech company.',
          size: '500',
          foundedIn: '2010-01-01',
          isVerified: 'true',
          userId: insertedUsers[2].id,
        });

        console.log('Seeding completed!');
      }

      seed().catch((err) => {
        console.error('Seeding failed:', err);
        process.exit(1);
      });
    }
  } catch (error) {
    //
  }
};
