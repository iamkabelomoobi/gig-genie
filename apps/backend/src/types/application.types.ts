import { ApplicationStatus } from '@gig-genie/shared';
import type { Job, Candidate } from './index';

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type ApplicationCreateInput = {
  jobId: string;
  candidateId: string;
  status?: ApplicationStatus;
};

export type ApplicationUpdateInput = Partial<{
  status: ApplicationStatus;
}>;

export type ApplicationWithRelations = Application & {
  job?: Job;
  candidate?: Candidate;
};

export type ApplicationSearchParams = {
  jobId?: string;
  candidateId?: string;
  status?: ApplicationStatus;
  limit?: number;
  offset?: number;
};

export type ApplicationRepository = {
  create: (data: ApplicationCreateInput) => Promise<Application>;
  findById: (id: string) => Promise<ApplicationWithRelations | null>;
  findByJobId: (jobId: string) => Promise<ApplicationWithRelations[]>;
  findByCandidateId: (candidateId: string) => Promise<ApplicationWithRelations[]>;
  findAll: (params?: ApplicationSearchParams) => Promise<ApplicationWithRelations[]>;
  update: (id: string, data: ApplicationUpdateInput) => Promise<ApplicationWithRelations | null>;
  delete: (id: string) => Promise<boolean>;
};
