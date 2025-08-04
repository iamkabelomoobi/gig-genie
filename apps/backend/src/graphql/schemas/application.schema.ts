import { gql } from 'graphql-tag';

export const applicationTypeDefs = gql`
  """
  Job application in the system.
  """
  type Application {
    id: String!
    candidateId: String!
    jobId: String!
    status: ApplicationStatus!
    coverLetter: String
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    candidate: Candidate!
    job: Job!
  }

  enum ApplicationStatus {
    PENDING
    ACCEPTED
    REJECTED
    WITHDRAWN
  }

  extend type Query {
    applications: [Application!]!
    application(id: String!): Application
  }

  extend type Mutation {
    createApplication(
      candidateId: String!
      jobId: String!
      coverLetter: String
      status: ApplicationStatus!
    ): Application!
    deleteApplication(id: String!): Boolean!
  }
`;
