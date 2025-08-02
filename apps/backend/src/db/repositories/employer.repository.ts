/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq, isNull, and, like, or, lte, gte } from 'drizzle-orm';
import type {
  Employer,
  EmployerCreateInput,
  EmployerRepository,
  EmployerUpdateInput,
  EmployerSearchParams,
  EmployerWithUser,
} from '../../types';
import { employers, users } from '../schemas';
import { dbClient } from '../client';

/**
 * Repository for managing employer data in the database
 */
export const employerRepository: EmployerRepository = {
  create: async (data: EmployerCreateInput): Promise<Employer> => {
    const dataToInsert = {
      ...data,
      foundedIn:
        data.foundedIn instanceof Date
          ? data.foundedIn.toISOString().split('T')[0]
          : data.foundedIn,
    };

    const [employer] = await dbClient
      .insert(employers)
      .values(dataToInsert)
      .returning();
    return employer;
  },

  findById: async (id: string): Promise<EmployerWithUser | null> => {
    const result = await dbClient
      .select({
        employer: employers,
        user: users,
      })
      .from(employers)
      .innerJoin(users, eq(employers.userId, users.id))
      .where(and(eq(employers.id, id), isNull(employers.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { employer, user } = result[0];

    const { password, ...userWithoutPassword } = user;

    return { ...employer, user: userWithoutPassword };
  },

  findByUserId: async (userId: string): Promise<EmployerWithUser | null> => {
    const result = await dbClient
      .select({
        employer: employers,
        user: users,
      })
      .from(employers)
      .innerJoin(users, eq(employers.userId, users.id))
      .where(and(eq(employers.userId, userId), isNull(employers.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { employer, user } = result[0];

    const { password, ...userWithoutPassword } = user;

    return { ...employer, user: userWithoutPassword };
  },

  findAll: async (
    searchParams?: EmployerSearchParams
  ): Promise<EmployerWithUser[]> => {
    const conditions = [isNull(employers.deletedAt)];

    if (searchParams) {
      if (searchParams.query) {
        const searchCondition = or(
          like(employers.companyName, `%${searchParams.query}%`),
          like(employers.description, `%${searchParams.query}%`)
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      if (searchParams.industry) {
        conditions.push(eq(employers.industry, searchParams.industry));
      }

      if (searchParams.location) {
        conditions.push(like(employers.location, `%${searchParams.location}%`));
      }

      if (searchParams.minSize) {
        conditions.push(gte(employers.size, searchParams.minSize));
      }

      if (searchParams.maxSize) {
        conditions.push(lte(employers.size, searchParams.maxSize));
      }
    }

    const baseQuery = dbClient
      .select({
        employer: employers,
        user: users,
      })
      .from(employers)
      .innerJoin(users, eq(employers.userId, users.id))
      .where(and(...conditions));

    const finalQuery =
      searchParams?.limit !== undefined || searchParams?.offset !== undefined
        ? baseQuery
            .limit(searchParams?.limit ?? 50)
            .offset(searchParams?.offset ?? 0)
        : baseQuery;

    const result = await finalQuery;

    return result.map(({ employer, user }) => {
      const { password, ...userWithoutPassword } = user;
      return { ...employer, user: userWithoutPassword };
    });
  },

  update: async (
    id: string,
    data: EmployerUpdateInput
  ): Promise<EmployerWithUser | null> => {
    const [updatedEmployer] = await dbClient
      .update(employers)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(employers.id, id))
      .returning();

    if (!updatedEmployer) return null;

    return employerRepository.findById(id);
  },
};
