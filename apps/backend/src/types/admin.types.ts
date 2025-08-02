import { AdminType } from '@gig-genie/shared';
import { UserWithoutPassword } from './user.types';

export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  type: AdminType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type AdminWithUser = Admin & {
  user: UserWithoutPassword;
};

export type AdminCreateInput = {
  firstName: string;
  lastName: string;
  type?: AdminType;
  userId: string;
};

export type AdminUpdateInput = Partial<{
  firstName: string;
  lastName: string;
}>;

export type AdminUpdateType = {
  type: AdminType;
};

export type AdminSearchParams = {
  query?: string;
  type?: AdminType;
  limit?: number;
  offset?: number;
};

export type AdminRepository = {
  create: (data: AdminCreateInput) => Promise<Admin>;
  findById: (id: string) => Promise<AdminWithUser | null>;
  findByUserId: (userId: string) => Promise<AdminWithUser | null>;
  findAll: (params?: AdminSearchParams) => Promise<AdminWithUser[]>;
  update: (id: string, data: AdminUpdateInput) => Promise<AdminWithUser | null>;
  updateType: (id: string, data: AdminUpdateType) => Promise<AdminWithUser | null>;
};
