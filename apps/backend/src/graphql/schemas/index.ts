import { adminTypeDefs } from './admin.schema';
import { userTypeDefs } from './user.schema';
import { candidateTypeDefs } from './candidate.schema';
import { employerTypeDefs } from './employer.schema';
import { jobTypeDefs } from './job.schema';
import { applicationTypeDefs } from './application.schema';
import { resumeTypeDefs } from './resume.schema';
import { gql } from 'graphql-tag';

const baseTypeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export const typeDefs = [
  baseTypeDefs,
  adminTypeDefs,
  userTypeDefs,
  candidateTypeDefs,
  employerTypeDefs,
  jobTypeDefs,
  applicationTypeDefs,
  resumeTypeDefs,
];
