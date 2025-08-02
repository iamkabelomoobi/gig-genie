import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './user.schema';


export const employers = pgTable('Employers', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: varchar('companyName', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  industry: varchar('industry', { length: 255 }).notNull(),
  websiteUrl: varchar('websiteUrl', { length: 255 }).notNull().unique(),
  location: varchar('location', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  size: numeric('size'),
  foundedIn: date('foundedIn').notNull(),
  isVerified: varchar('isVerified', { length: 255 }).notNull(),
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


export const employersRelations = relations(employers, ({ one }) => ({
  user: one(users, {
    fields: [employers.userId],
    references: [users.id],
  }),
}));
