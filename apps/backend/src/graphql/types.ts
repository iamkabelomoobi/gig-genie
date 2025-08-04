export interface ResolverContext {
  // You can add authentication context, data loaders, etc. here
  req: any;
  res: any;
}

// Utility type for resolver function
export type ResolverFn<TArgs = any, TResult = any> = (
  parent: any,
  args: TArgs,
  context: ResolverContext,
  info: any
) => Promise<TResult> | TResult;

// GraphQL types matching your database schema
export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  admin?: Admin;
  candidate?: Candidate;
  employer?: Employer;
}

export interface Candidate {
  id: string;
  userId: string;
  resume?: string;
  experience?: string;
  skills?: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: User;
}

export interface Employer {
  id: string;
  userId: string;
  companyName: string;
  companyWebsite?: string;
  companyDescription?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: User;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  description: string;
  location?: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  employer?: Employer;
}

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidate?: Candidate;
  job?: Job;
}

export interface Resume {
  id: string;
  candidateId: string;
  fileUrl: string;
  summary?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  candidate?: Candidate;
}
