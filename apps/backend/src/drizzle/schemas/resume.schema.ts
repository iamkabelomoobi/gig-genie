import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { candidates } from './candidate.schema';

export const resumes = pgTable('Resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  candidateId: uuid('candidateId')
    .notNull()
    .references(() => candidates.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  fileUrl: varchar('fileUrl', { length: 255 }).notNull(),
  fileName: varchar('fileName', { length: 255 }).notNull(),
  fileType: varchar('fileType', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

export const resumesRelations = relations(resumes, ({ one }) => ({
  candidate: one(candidates, {
    fields: [resumes.candidateId],
    references: [candidates.id],
  }),
}));
