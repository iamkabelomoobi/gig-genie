/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq, isNull, and } from 'drizzle-orm';
import type {
  Admin,
  AdminCreateInput,
  AdminRepository,
  AdminUpdateInput,
  AdminUpdateType,
  AdminWithUser,
} from '../../types';
import { admins, users } from '../schemas';
import { dbClient } from '../client';

/**
 * Repository for managing admin data in the database
 */
export const adminRepository: AdminRepository = {
  create: async (data: AdminCreateInput): Promise<Admin> => {
    const [admin] = await dbClient
      .insert(admins)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return admin;
  },

  findById: async (id: string): Promise<AdminWithUser | null> => {
    const result = await dbClient
      .select({
        admin: admins,
        user: users,
      })
      .from(admins)
      .innerJoin(users, eq(admins.userId, users.id))
      .where(and(eq(admins.id, id), isNull(admins.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { admin, user } = result[0];

    const { password, ...userWithoutPassword } = user;

    return { ...admin, user: userWithoutPassword };
  },

  findByUserId: async (userId: string): Promise<AdminWithUser | null> => {
    const result = await dbClient
      .select({
        admin: admins,
        user: users,
      })
      .from(admins)
      .innerJoin(users, eq(admins.userId, users.id))
      .where(and(eq(admins.userId, userId), isNull(admins.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { admin, user } = result[0];

    const { password, ...userWithoutPassword } = user;

    return { ...admin, user: userWithoutPassword };
  },

  findAll: async (): Promise<AdminWithUser[]> => {
    const result = await dbClient
      .select({
        admin: admins,
        user: users,
      })
      .from(admins)
      .innerJoin(users, eq(admins.userId, users.id))
      .where(isNull(admins.deletedAt));

    return result.map(({ admin, user }) => {
      const { password, ...userWithoutPassword } = user;
      return { ...admin, user: userWithoutPassword };
    });
  },

  update: async (
    id: string,
    data: AdminUpdateInput
  ): Promise<AdminWithUser | null> => {
    const [admin] = await dbClient
      .update(admins)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, id))
      .returning();

    if (!admin) return null;

    const result = await dbClient
      .select({
        admin: admins,
        user: users,
      })
      .from(admins)
      .innerJoin(users, eq(admins.userId, users.id))
      .where(and(eq(admins.id, id), isNull(admins.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { admin: updatedAdmin, user } = result[0];
    const { password, ...userWithoutPassword } = user;

    return { ...updatedAdmin, user: userWithoutPassword };
  },

  updateType: async (
    id: string,
    data: AdminUpdateType
  ): Promise<AdminWithUser | null> => {
    const [admin] = await dbClient
      .update(admins)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, id))
      .returning();

    if (!admin) return null;

    const result = await dbClient
      .select({
        admin: admins,
        user: users,
      })
      .from(admins)
      .innerJoin(users, eq(admins.userId, users.id))
      .where(and(eq(admins.id, id), isNull(admins.deletedAt)))
      .limit(1);

    if (result.length === 0) return null;

    const { admin: updatedAdmin, user } = result[0];
    const { password, ...userWithoutPassword } = user;

    return { ...updatedAdmin, user: userWithoutPassword };
  },
};
