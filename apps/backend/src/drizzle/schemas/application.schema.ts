import { pgTable, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { jobs } from './job.schema';
import { candidates } from './candidate.schema';
import { ApplicationStatus } from '@gig-genie/shared';

export const applicationStatusEnum = pgEnum(
  'application_status',
  ApplicationStatus
);

export const applications = pgTable('Applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('jobId')
    .notNull()
    .references(() => jobs.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  candidateId: uuid('candidateId')
    .notNull()
    .references(() => candidates.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  status: applicationStatusEnum('status')
    .notNull()
    .default(ApplicationStatus.Submitted),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  candidate: one(candidates, {
    fields: [applications.candidateId],
    references: [candidates.id],
  }),
}));
