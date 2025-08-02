import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';

export const candidates = pgTable('Candidates', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('firstName', { length: 255 }).notNull(),
  lastName: varchar('lastName', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  skills: varchar('skills', { length: 255 }),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

export const candidatesRelations = relations(candidates, ({ one }) => ({
  user: one(users, {
    fields: [candidates.userId],
    references: [users.id],
  }),
}));
