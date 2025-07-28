export type Employer = {
  id: string;
  companyName: string;
  industry: string;
  websiteUrl: string;
  location: string;
  description: string;
  size?: number | null;
  foundedIn: Date;
  isVerified: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type EmployerCreateInput = {
  companyName: string;
  industry: string;
  websiteUrl: string;
  location: string;
  description: string;
  size?: number;
  foundedIn: Date;
  isVerified?: string;
  userId: string;
};

export type EmployerUpdateInput = Partial<{
  companyName: string;
  industry: string;
  websiteUrl: string;
  location: string;
  description: string;
  size: number;
  foundedIn: Date;
  isVerified: string;
}>;

export type EmployerSearchParams = {
  query?: string;
  industry?: string;
  location?: string;
  minSize?: number;
  maxSize?: number;
  limit?: number;
  offset?: number;
};
