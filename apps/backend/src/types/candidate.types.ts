import { UserWithoutPassword } from './user.types';

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  skills?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type CandidateWithUser = Candidate & {
  user: UserWithoutPassword;
};

export type CandidateCreateInput = {
  firstName: string;
  lastName: string;
  title: string;
  skills?: string;
  userId: string;
};

export type CandidateUpdateInput = Partial<{
  firstName: string;
  lastName: string;
  title: string;
  skills: string;
}>;

export type CandidateSearchParams = {
  query?: string;
  title?: string;
  skills?: string;
  limit?: number;
  offset?: number;
};

export type CandidateRepository = {
  create: (data: CandidateCreateInput) => Promise<Candidate>;
  findById: (id: string) => Promise<CandidateWithUser | null>;
  findByUserId: (userId: string) => Promise<CandidateWithUser | null>;
  findAll: (params?: CandidateSearchParams) => Promise<CandidateWithUser[]>;
  update: (
    id: string,
    data: CandidateUpdateInput
  ) => Promise<CandidateWithUser | null>;
};
