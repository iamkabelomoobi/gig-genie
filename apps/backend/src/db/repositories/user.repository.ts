import { eq, isNull, and, like, or } from 'drizzle-orm';
import type {
  User,
  UserCreateInput,
  UserRepository,
  UserUpdateInput,
  UserSearchParams,
} from '../../types';
import { users } from '../schemas';
import { dbClient } from '../client';

/**
 * Repository for managing user data in the database
 */
export const userRepository: UserRepository = {
  create: async (data: UserCreateInput): Promise<User> => {
    const [user] = await dbClient.insert(users).values(data).returning();
    return user;
  },

  findById: async (id: string): Promise<User | null> => {
    const result = await dbClient
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const result = await dbClient
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  },

  findByPhone: async (phone: string): Promise<User | null> => {
    const result = await dbClient
      .select()
      .from(users)
      .where(and(eq(users.phone, phone), isNull(users.deletedAt)))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  },

  findAll: async (searchParams?: UserSearchParams): Promise<User[]> => {
    const conditions = [isNull(users.deletedAt)];

    if (searchParams) {
      if (searchParams.query) {
        const searchCondition = or(
          like(users.email, `%${searchParams.query}%`),
          like(users.phone, `%${searchParams.query}%`)
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      if (searchParams.role) {
        conditions.push(eq(users.role, searchParams.role));
      }

      if (searchParams.isVerified !== undefined) {
        conditions.push(eq(users.isVerified, searchParams.isVerified));
      }
    }

    const baseQuery = dbClient
      .select()
      .from(users)
      .where(and(...conditions));

    const finalQuery =
      searchParams?.limit !== undefined || searchParams?.offset !== undefined
        ? baseQuery
            .limit(searchParams?.limit ?? 50)
            .offset(searchParams?.offset ?? 0)
        : baseQuery;

    return await finalQuery;
  },

  update: async (id: string, data: UserUpdateInput): Promise<User | null> => {
    const [updatedUser] = await dbClient
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return updatedUser || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const [deletedUser] = await dbClient
      .update(users)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return !!deletedUser;
  },
};
