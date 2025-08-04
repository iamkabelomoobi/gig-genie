import { gql } from 'graphql-tag';

export const jobTypeDefs = gql`
  """
  Job posting in the system.
  """
  type Job {
    id: String!
    employerId: String!
    title: String!
    description: String!
    location: String
    type: JobType!
    status: JobStatus!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    employer: Employer!
  }

  enum JobType {
    FULL_TIME
    PART_TIME
    CONTRACT
    TEMPORARY
    INTERNSHIP
  }

  enum JobStatus {
    OPEN
    CLOSED
    PAUSED
  }

  extend type Query {
    jobs: [Job!]!
    job(id: String!): Job
  }

  extend type Mutation {
    createJob(
      employerId: String!
      title: String!
      description: String!
      location: String
      type: JobType!
      status: JobStatus!
    ): Job!
    deleteJob(id: String!): Boolean!
  }
`;
