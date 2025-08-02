/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq, isNull, and } from 'drizzle-orm';
import type {
  Candidate,
  CandidateCreateInput,
  CandidateRepository,
  CandidateUpdateInput,
  CandidateWithUser,
} from '../../types';
import { candidates, users } from '../schemas';
import { dbClient } from '../client';

/**
 * Repository for managing candidate data in the database
 */
export const candidateRepository: CandidateRepository = {
 
  create: async (data: CandidateCreateInput): Promise<Candidate> => {
    const [candidate] = await dbClient
      .insert(candidates)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return candidate;
  },


  findById: async (id: string): Promise<CandidateWithUser | null> => {
    const result = await dbClient
      .select({
        candidate: candidates,
        user: users,
      })
      .from(candidates)
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(and(eq(candidates.id, id), isNull(candidates.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { candidate, user } = result[0];

    const { password, ...userWithoutPassword } = user;

    return { ...candidate, user: userWithoutPassword };
  },


  findByUserId: async (userId: string): Promise<CandidateWithUser | null> => {
    const result = await dbClient
      .select({
        candidate: candidates,
        user: users,
      })
      .from(candidates)
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(and(eq(candidates.userId, userId), isNull(candidates.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { candidate, user } = result[0];

    const { password, ...userWithoutPassword } = user;

    return { ...candidate, user: userWithoutPassword };
  },

  findAll: async (): Promise<CandidateWithUser[]> => {
    const result = await dbClient
      .select({
        candidate: candidates,
        user: users,
      })
      .from(candidates)
      .innerJoin(users, eq(candidates.userId, users.id))
      .where(isNull(candidates.deletedAt));

    return result.map(({ candidate, user }) => {
      const { password, ...userWithoutPassword } = user;
      return { ...candidate, user: userWithoutPassword };
    });
  },

  
  update: async (
    id: string,
    data: CandidateUpdateInput
  ): Promise<CandidateWithUser | null> => {
    const [updatedCandidate] = await dbClient
      .update(candidates)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, id))
      .returning();

    if (!updatedCandidate) return null;

    return candidateRepository.findById(id);
  },
};
