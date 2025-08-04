import { gql } from 'graphql-tag';

export const candidateTypeDefs = gql`
  """
  Candidate profile in the system.
  """
  type Candidate {
    id: String!
    userId: String!
    resume: String
    experience: String
    skills: [String!]
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    user: User!
  }

  extend type Query {
    candidates: [Candidate!]!
    candidate(id: String!): Candidate
  }

  extend type Mutation {
    createCandidate(
      userId: String!
      resume: String
      experience: String
      skills: [String!]
    ): Candidate!
    deleteCandidate(id: String!): Boolean!
  }
`;
