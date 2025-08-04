import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  """
  User account in the system.
  """
  type User {
    id: String!
    email: String!
    phone: String!
    password: String
    role: UserRole!
    isVerified: Boolean!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    admin: Admin
    candidate: Candidate
    employer: Employer
  }

  enum UserRole {
    ADMIN
    CANDIDATE
    EMPLOYER
  }

  extend type Query {
    users: [User!]!
    user(id: String!): User
  }

  extend type Mutation {
    createUser(
      email: String!
      phone: String!
      password: String!
      role: UserRole!
    ): User!
    deleteUser(id: String!): Boolean!
  }
`;
