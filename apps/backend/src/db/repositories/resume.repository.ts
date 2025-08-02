/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq, isNull, and } from 'drizzle-orm';
import type {
  Resume,
  ResumeCreateInput,
  ResumeUpdateInput,
  ResumeSearchParams,
  ResumeWithRelations,
  ResumeRepository,
  CandidateWithUser,
} from '../../types';
import { resumes, candidates, users } from '../schemas';
import { dbClient } from '../client';

/**
 * Repository for managing resume data in the database
 */
export const resumeRepository: ResumeRepository = {
  create: async (data: ResumeCreateInput): Promise<Resume> => {
    const [resume] = await dbClient.insert(resumes).values(data).returning();
    return resume;
  },

  findById: async (id: string): Promise<ResumeWithRelations | null> => {
    const result = await dbClient
      .select({
        resume: resumes,
        candidate: candidates,
        user: users,
      })
      .from(resumes)
      .innerJoin(candidates, eq(resumes.candidateId, candidates.id))
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(and(eq(resumes.id, id), isNull(resumes.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { resume, candidate, user } = result[0];

    const { password, ...userWithoutPassword } = user;

    return {
      ...resume,
      candidate: {
        ...candidate,
        user: userWithoutPassword,
      } as CandidateWithUser,
    };
  },

  findByCandidateId: async (
    candidateId: string
  ): Promise<ResumeWithRelations[]> => {
    const result = await dbClient
      .select({
        resume: resumes,
        candidate: candidates,
        user: users,
      })
      .from(resumes)
      .innerJoin(candidates, eq(resumes.candidateId, candidates.id))
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(
        and(eq(resumes.candidateId, candidateId), isNull(resumes.deletedAt))
      );

    return result.map(({ resume, candidate, user }) => {
      const { password, ...userWithoutPassword } = user;

      return {
        ...resume,
        candidate: {
          ...candidate,
          user: userWithoutPassword,
        } as CandidateWithUser,
      };
    });
  },

  findAll: async (
    searchParams?: ResumeSearchParams
  ): Promise<ResumeWithRelations[]> => {
    const conditions = [isNull(resumes.deletedAt)];

    if (searchParams) {
      if (searchParams.candidateId) {
        conditions.push(eq(resumes.candidateId, searchParams.candidateId));
      }

      if (searchParams.fileType) {
        conditions.push(eq(resumes.fileType, searchParams.fileType));
      }
    }

    const baseQuery = dbClient
      .select({
        resume: resumes,
        candidate: candidates,
        user: users,
      })
      .from(resumes)
      .innerJoin(candidates, eq(resumes.candidateId, candidates.id))
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(and(...conditions));

    const finalQuery =
      searchParams?.limit !== undefined || searchParams?.offset !== undefined
        ? baseQuery
            .limit(searchParams?.limit ?? 50)
            .offset(searchParams?.offset ?? 0)
        : baseQuery;

    const result = await finalQuery;

    return result.map(({ resume, candidate, user }) => {
      const { password, ...userWithoutPassword } = user;

      return {
        ...resume,
        candidate: {
          ...candidate,
          user: userWithoutPassword,
        } as CandidateWithUser,
      };
    });
  },

  update: async (
    id: string,
    data: ResumeUpdateInput
  ): Promise<ResumeWithRelations | null> => {
    const [updatedResume] = await dbClient
      .update(resumes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, id))
      .returning();

    if (!updatedResume) return null;

    return resumeRepository.findById(id);
  },

  delete: async (id: string): Promise<boolean> => {
    const [deletedResume] = await dbClient
      .update(resumes)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(resumes.id, id))
      .returning();

    return !!deletedResume;
  },
};
