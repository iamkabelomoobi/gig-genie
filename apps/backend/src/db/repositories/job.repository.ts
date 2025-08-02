/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq, isNull, and, like, or, gte } from 'drizzle-orm';
import type {
  Job,
  JobCreateInput,
  JobUpdateInput,
  JobSearchParams,
  JobWithRelations,
  JobRepository,
  EmployerWithUser,
} from '../../types';
import { jobs, employers, applications, users } from '../schemas';
import { dbClient } from '../client';

/**
 * Repository for managing job data in the database
 */
export const jobRepository: JobRepository = {
  create: async (data: JobCreateInput): Promise<Job> => {
    const dataToInsert = {
      ...data,
      views: 0,
      isPublic: data.isPublic ?? true,
    };

    const [job] = await dbClient.insert(jobs).values(dataToInsert).returning();

    return {
      ...job,
      deadline: new Date(job.deadline),
      views: job.views ?? 0,
      isPublic: job.isPublic ?? true,
    };
  },

  findById: async (id: string): Promise<JobWithRelations | null> => {
    const result = await dbClient
      .select({
        job: jobs,
        employer: employers,
        user: users,
      })
      .from(jobs)
      .innerJoin(employers, eq(jobs.employerId, employers.id))
      .innerJoin(users, eq(employers.userId, users.id))
      .where(and(eq(jobs.id, id), isNull(jobs.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { job, employer, user } = result[0];

    const jobApplications = await dbClient
      .select()
      .from(applications)
      .where(and(eq(applications.jobId, id), isNull(applications.deletedAt)));

    const { password, ...userWithoutPassword } = user;

    return {
      ...job,
      deadline: new Date(job.deadline),
      views: job.views ?? 0,
      isPublic: job.isPublic ?? true,
      employer: { ...employer, user: userWithoutPassword } as EmployerWithUser,
      applications: jobApplications.map((app) => ({
        ...app,
      })),
    };
  },

  findByEmployerId: async (employerId: string): Promise<JobWithRelations[]> => {
    const result = await dbClient
      .select({
        job: jobs,
        employer: employers,
        user: users,
      })
      .from(jobs)
      .innerJoin(employers, eq(jobs.employerId, employers.id))
      .innerJoin(users, eq(employers.userId, users.id))
      .where(and(eq(jobs.employerId, employerId), isNull(jobs.deletedAt)));

    return Promise.all(
      result.map(async ({ job, employer, user }) => {
        const jobApplications = await dbClient
          .select()
          .from(applications)
          .where(
            and(eq(applications.jobId, job.id), isNull(applications.deletedAt))
          );

        const { password, ...userWithoutPassword } = user;

        return {
          ...job,
          deadline: new Date(job.deadline),
          views: job.views ?? 0,
          isPublic: job.isPublic ?? true,
          employer: {
            ...employer,
            user: userWithoutPassword,
          } as EmployerWithUser,
          applications: jobApplications.map((app) => ({
            ...app,
          })),
        };
      })
    );
  },

  findAll: async (
    searchParams?: JobSearchParams
  ): Promise<JobWithRelations[]> => {
    const conditions = [isNull(jobs.deletedAt)];

    if (searchParams) {
      if (searchParams.query) {
        const searchCondition = or(
          like(jobs.title, `%${searchParams.query}%`),
          like(jobs.description, `%${searchParams.query}%`)
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      if (searchParams.location) {
        conditions.push(like(jobs.location, `%${searchParams.location}%`));
      }

      if (searchParams.type) {
        conditions.push(eq(jobs.type, searchParams.type));
      }

      if (searchParams.tags) {
        conditions.push(like(jobs.tags, `%${searchParams.tags}%`));
      }

      if (searchParams.minVacancy !== undefined) {
        conditions.push(gte(jobs.vacancy, searchParams.minVacancy));
      }

      if (searchParams.deadlineAfter) {
        conditions.push(gte(jobs.deadline, searchParams.deadlineAfter));
      }
    }

    const baseQuery = dbClient
      .select({
        job: jobs,
        employer: employers,
        user: users,
      })
      .from(jobs)
      .innerJoin(employers, eq(jobs.employerId, employers.id))
      .innerJoin(users, eq(employers.userId, users.id))
      .where(and(...conditions));

    const finalQuery =
      searchParams?.limit !== undefined || searchParams?.offset !== undefined
        ? baseQuery
            .limit(searchParams?.limit ?? 50)
            .offset(searchParams?.offset ?? 0)
        : baseQuery;

    const result = await finalQuery;

    return Promise.all(
      result.map(async ({ job, employer, user }) => {
        const jobApplications = await dbClient
          .select()
          .from(applications)
          .where(
            and(eq(applications.jobId, job.id), isNull(applications.deletedAt))
          );

        const { password, ...userWithoutPassword } = user;

        return {
          ...job,
          deadline: new Date(job.deadline),
          views: job.views ?? 0,
          isPublic: job.isPublic ?? true,
          employer: {
            ...employer,
            user: userWithoutPassword,
          } as EmployerWithUser,
          applications: jobApplications.map((app) => ({
            ...app,
          })),
        };
      })
    );
  },

  update: async (
    id: string,
    data: JobUpdateInput
  ): Promise<JobWithRelations | null> => {
    const [updatedJob] = await dbClient
      .update(jobs)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id))
      .returning();

    if (!updatedJob) return null;

    return jobRepository.findById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const [deletedJob] = await dbClient
      .update(jobs)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id))
      .returning();

    return !!deletedJob;
  },

  incrementViews: async (id: string): Promise<boolean> => {
    const job = await dbClient
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), isNull(jobs.deletedAt)))
      .limit(1);

    if (job.length === 0) return false;

    const [updatedJob] = await dbClient
      .update(jobs)
      .set({
        views: (job[0].views ?? 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, id))
      .returning();

    return !!updatedJob;
  },
};
