import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { employers } from './employer.schema';
import { JobType } from '@gig-genie/shared';

export const jobTypeEnum = pgEnum('job_type', JobType);

export const jobs = pgTable('Jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  responsibilities: varchar('responsibilities', { length: 1024 }),
  requirements: varchar('requirements', { length: 1024 }),
  benefits: varchar('benefits', { length: 1024 }),
  location: varchar('location', { length: 255 }).notNull(),
  type: jobTypeEnum('type').notNull().default(JobType.FullTime),
  vacancy: integer('vacancy'),
  deadline: date('deadline').notNull(),
  tags: varchar('tags', { length: 255 }),
  employerId: uuid('employerId')
    .notNull()
    .references(() => employers.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  views: integer('views').default(0),
  isPublic: boolean('isPublic'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

export const jobsRelations = relations(jobs, ({ one }) => ({
  employer: one(employers, {
    fields: [jobs.employerId],
    references: [employers.id],
  }),
}));
