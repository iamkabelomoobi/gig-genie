import { Candidate } from './candidate.types';

export type Resume = {
  id: string;
  candidateId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type ResumeCreateInput = {
  candidateId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
};

export type ResumeUpdateInput = Partial<{
  fileName: string;
  fileUrl: string;
  fileType: string;
}>;

export type ResumeSearchParams = {
  candidateId?: string;
  fileType?: string;
  limit?: number;
  offset?: number;
};

export type ResumeWithRelations = Resume & {
  candidate?: Candidate;
};

export type ResumeRepository = {
  create: (data: ResumeCreateInput) => Promise<Resume>;
  findById: (id: string) => Promise<ResumeWithRelations | null>;
  findByCandidateId: (candidateId: string) => Promise<ResumeWithRelations[]>;
  findAll: (params?: ResumeSearchParams) => Promise<ResumeWithRelations[]>;
  update: (
    id: string,
    data: ResumeUpdateInput
  ) => Promise<ResumeWithRelations | null>;
  delete: (id: string) => Promise<boolean>;
};
