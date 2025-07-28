import { AdminType } from '@gig-genie/shared';

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

export type AdminCreateInput = {
  firstName: string;
  lastName: string;
  type?: AdminType;
  userId: string;
};

export type AdminUpdateInput = Partial<{
  firstName: string;
  lastName: string;
  type: AdminType;
}>;
