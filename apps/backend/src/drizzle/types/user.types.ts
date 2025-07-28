import { UserRole } from "@gig-genie/shared";

export type User = {
  id: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type UserCreateInput = {
  email: string;
  phone: string;
  password?: string;
  role?: UserRole;
};

export type UserUpdateInput = Partial<{
  email: string;
  phone: string;
  password: string;
  isVerified: boolean;
}>;
