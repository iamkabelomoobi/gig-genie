import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { UserRole } from '@gig-genie/shared';
import { admins } from './admin.schema';
import { candidates } from './candidate.schema';
import { employers } from './employer.schema';

export const userRoleEnum = pgEnum('user_role', UserRole);

export const users = pgTable('Users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  role: userRoleEnum('role').notNull().default(UserRole.CANDIDATE),
  isVerified: boolean('isVerified').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  deletedAt: timestamp('deletedAt'),
});

export const usersRelations = relations(users, ({ one }) => ({
  admin: one(admins, {
    fields: [users.id],
    references: [admins.userId],
  }),
  candidate: one(candidates, {
    fields: [users.id],
    references: [candidates.userId],
  }),
  employer: one(employers, {
    fields: [users.id],
    references: [employers.userId],
  }),
}));
