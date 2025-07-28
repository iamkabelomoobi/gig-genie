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
