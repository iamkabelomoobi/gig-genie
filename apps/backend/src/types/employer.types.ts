import { UserWithoutPassword } from './user.types';

export type Employer = {
  id: string;
  companyName: string;
  slug: string;
  industry: string;
  websiteUrl: string;
  location: string;
  description: string;
  size?: string | null;
  foundedIn: string | Date;
  isVerified: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type EmployerWithUser = Employer & {
  user: UserWithoutPassword;
};

export type EmployerCreateInput = {
  companyName: string;
  slug: string;
  industry: string;
  websiteUrl: string;
  location: string;
  description: string;
  size?: string;
  foundedIn: string | Date;
  isVerified: string;
  userId: string;
};

export type EmployerUpdateInput = Partial<{
  companyName: string;
  slug: string;
  industry: string;
  websiteUrl: string;
  location: string;
  description: string;
  size: string;
  foundedIn: string;
  isVerified: string;
}>;

export type EmployerSearchParams = {
  query?: string;
  industry?: string;
  location?: string;
  minSize?: string;
  maxSize?: string;
  limit?: number;
  offset?: number;
};

export type EmployerRepository = {
  create: (data: EmployerCreateInput) => Promise<Employer>;
  findById: (id: string) => Promise<EmployerWithUser | null>;
  findByUserId: (userId: string) => Promise<EmployerWithUser | null>;
  findAll: (params?: EmployerSearchParams) => Promise<EmployerWithUser[]>;
  update: (
    id: string,
    data: EmployerUpdateInput
  ) => Promise<EmployerWithUser | null>;
};
