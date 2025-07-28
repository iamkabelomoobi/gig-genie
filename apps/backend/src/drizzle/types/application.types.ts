import { enums } from '@kasi-flow/shared';
import type { Job, Candidate } from './index';

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  status: enums.ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type ApplicationCreateInput = {
  jobId: string;
  candidateId: string;
  status?: enums.ApplicationStatus;
};

export type ApplicationUpdateInput = Partial<{
  status: enums.ApplicationStatus;
}>;

export type ApplicationWithRelations = Application & {
  job?: Job;
  candidate?: Candidate;
};
