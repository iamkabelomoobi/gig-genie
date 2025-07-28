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
