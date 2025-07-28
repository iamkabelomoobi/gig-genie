import { enums } from '@kasi-flow/shared';

export type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  type: enums.AdminType;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type AdminCreateInput = {
  firstName: string;
  lastName: string;
  type?: enums.AdminType;
  userId: string;
};

export type AdminUpdateInput = Partial<{
  firstName: string;
  lastName: string;
  type: enums.AdminType;
}>;
