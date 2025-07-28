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
}>;

export type ResumeWithRelations = Resume & {
  candidate?: Candidate;
};
