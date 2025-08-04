import { gql } from 'graphql-tag';

export const employerTypeDefs = gql`
  """
  Employer profile in the system.
  """
  type Employer {
    id: String!
    userId: String!
    companyName: String!
    companyWebsite: String
    companyDescription: String
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    user: User!
  }

  extend type Query {
    employers: [Employer!]!
    employer(id: String!): Employer
  }

  extend type Mutation {
    createEmployer(
      userId: String!
      companyName: String!
      companyWebsite: String
      companyDescription: String
    ): Employer!
  }
`;
