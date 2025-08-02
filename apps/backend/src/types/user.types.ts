import { UserRole } from '@gig-genie/shared';

export type User = {
  id: string;
  email: string;
  phone: string;
  password?: string | null;
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

export type UserSearchParams = {
  query?: string;
  role?: UserRole;
  isVerified?: boolean;
  limit?: number;
  offset?: number;
};

export type UserWithoutPassword = Omit<User, 'password'>;

export type UserRepository = {
  create: (data: UserCreateInput) => Promise<User>;
  findById: (id: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  findByPhone: (phone: string) => Promise<User | null>;
  findAll: (params?: UserSearchParams) => Promise<User[]>;
  update: (id: string, data: UserUpdateInput) => Promise<User | null>;
  delete: (id: string) => Promise<boolean>;
};
