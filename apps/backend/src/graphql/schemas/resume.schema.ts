import { gql } from 'graphql-tag';

export const resumeTypeDefs = gql`
  """
  Resume entity in the system.
  """
  type Resume {
    id: String!
    candidateId: String!
    fileUrl: String!
    summary: String
    skills: [String!]
    experience: String
    education: String
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    candidate: Candidate!
  }

  extend type Query {
    resumes: [Resume!]!
    resume(id: String!): Resume
  }

  extend type Mutation {
    createResume(
      candidateId: String!
      fileUrl: String!
      summary: String
      skills: [String!]
      experience: String
      education: String
    ): Resume!

    deleteResume(id: String!): Boolean!
  }
`;
