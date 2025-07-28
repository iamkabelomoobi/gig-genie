import { JobType } from "@gig-genie/shared";
import { Employer } from './employer.types';
import { Application } from './application.types';

export type Job = {
  id: string;
  title: string;
  description: string;
  responsibilities?: string | null;
  requirements?: string | null;
  benefits?: string | null;
  location: string;
  type: JobType;
  vacancy?: number | null;
  deadline: Date;
  tags?: string | null;
  employerId: string;
  views: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type JobCreateInput = {
  title: string;
  description: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  location: string;
  type?: JobType;
  vacancy?: number;
  deadline: Date;
  tags?: string;
  employerId: string;
  isPublic?: boolean;
};

export type JobUpdateInput = Partial<{
  title: string;
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  location: string;
  type: JobType;
  vacancy: number;
  deadline: Date;
  tags: string;
  isPublic: boolean;
}>;

export type JobSearchParams = {
  query?: string;
  location?: string;
  type?: JobType;
  tags?: string;
  minVacancy?: number;
  deadlineAfter?: Date;
  limit?: number;
  offset?: number;
};

export type JobWithRelations = Job & {
  employer?: Employer;
  applications?: Application[];
};
