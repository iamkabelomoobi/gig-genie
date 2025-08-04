/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq, isNull, and } from 'drizzle-orm';
import type {
  Application,
  ApplicationCreateInput,
  ApplicationUpdateInput,
  ApplicationSearchParams,
  ApplicationWithRelations,
  ApplicationRepository,
} from '../../types';
import { applications, jobs, candidates, users, employers } from '../schemas';
import { dbClient } from '../client';

/**
 * Repository for managing application data in the database
 */
export const applicationRepository: ApplicationRepository = {
  create: async (data: ApplicationCreateInput): Promise<Application> => {
    const [application] = await dbClient
      .insert(applications)
      .values(data)
      .returning();

    return application;
  },

  findById: async (id: string): Promise<ApplicationWithRelations | null> => {
    const result = await dbClient
      .select({
        application: applications,
        job: jobs,
        jobEmployer: employers,
        jobUser: users,
        candidate: candidates,
        candidateUser: users,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(employers, eq(jobs.employerId, employers.id))
      .innerJoin(users, eq(employers.userId, users.id))
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(and(eq(applications.id, id), isNull(applications.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { application, job, candidate } = result[0];

    return {
      ...application,
      job: {
        ...job,
        deadline: new Date(job.deadline),
        views: job.views ?? 0,
        isPublic: job.isPublic ?? true,
      },
      candidate,
    };
  },

  findByJobId: async (jobId: string): Promise<ApplicationWithRelations[]> => {
    const result = await dbClient
      .select({
        application: applications,
        job: jobs,
        candidate: candidates,
        candidateUser: users,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(
        and(eq(applications.jobId, jobId), isNull(applications.deletedAt))
      );

    return result.map(({ application, job, candidate, candidateUser }) => {
      const { password, ...userWithoutPassword } = candidateUser;

      return {
        ...application,
        job: {
          ...job,
          deadline: new Date(job.deadline),
          views: job.views ?? 0,
          isPublic: job.isPublic ?? true,
        },
        candidate: { ...candidate, user: userWithoutPassword },
      };
    });
  },

  findByCandidateId: async (
    candidateId: string
  ): Promise<ApplicationWithRelations[]> => {
    const result = await dbClient
      .select({
        application: applications,
        job: jobs,
        jobEmployer: employers,
        jobUser: users,
        candidate: candidates,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(employers, eq(jobs.employerId, employers.id))
      .innerJoin(users, eq(employers.userId, users.id))
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .where(
        and(
          eq(applications.candidateId, candidateId),
          isNull(applications.deletedAt)
        )
      );

    return result.map(
      ({ application, job, jobEmployer, jobUser, candidate }) => {
        const { password, ...userWithoutPassword } = jobUser;

        return {
          ...application,
          job: {
            ...job,
            deadline: new Date(job.deadline),
            views: job.views ?? 0,
            isPublic: job.isPublic ?? true,
            employer: { ...jobEmployer, user: userWithoutPassword },
          },
          candidate,
        };
      }
    );
  },

  findAll: async (
    searchParams?: ApplicationSearchParams
  ): Promise<ApplicationWithRelations[]> => {
    const conditions = [isNull(applications.deletedAt)];

    if (searchParams) {
      if (searchParams.jobId) {
        conditions.push(eq(applications.jobId, searchParams.jobId));
      }

      if (searchParams.candidateId) {
        conditions.push(eq(applications.candidateId, searchParams.candidateId));
      }

      if (searchParams.status) {
        conditions.push(eq(applications.status, searchParams.status));
      }
    }

    const baseQuery = dbClient
      .select({
        application: applications,
        job: jobs,
        candidate: candidates,
        candidateUser: users,
      })
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .innerJoin(candidates, eq(applications.candidateId, candidates.id))
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(and(...conditions));

    const finalQuery =
      searchParams?.limit !== undefined || searchParams?.offset !== undefined
        ? baseQuery
            .limit(searchParams?.limit ?? 50)
            .offset(searchParams?.offset ?? 0)
        : baseQuery;

    const result = await finalQuery;

    return result.map(({ application, job, candidate, candidateUser }) => {
      const { password, ...userWithoutPassword } = candidateUser;

      return {
        ...application,
        job: {
          ...job,
          deadline: new Date(job.deadline),
          views: job.views ?? 0,
          isPublic: job.isPublic ?? true,
        },
        candidate: { ...candidate, user: userWithoutPassword },
      };
    });
  },

  update: async (
    id: string,
    data: ApplicationUpdateInput
  ): Promise<ApplicationWithRelations | null> => {
    const [updatedApplication] = await dbClient
      .update(applications)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();

    if (!updatedApplication) return null;

    return applicationRepository.findById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const [deletedApplication] = await dbClient
      .update(applications)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(applications.id, id))
      .returning();

    return !!deletedApplication;
  },
};
