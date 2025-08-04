import { gql } from 'graphql-tag';

export const adminTypeDefs = gql`
  """
  Admin account in the system.
  """
  type Admin {
    id: String!
    firstName: String!
    lastName: String!
    type: AdminType!
    userId: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    user: User!
  }

  enum AdminType {
    SUPER_ADMIN
    MODERATOR
    SUPPORT
  }

  extend type Query {
    admins: [Admin!]!
    admin(id: String!): Admin
  }

  extend type Mutation {
    createAdmin(
      firstName: String!
      lastName: String!
      type: AdminType!
      userId: String!
    ): Admin!
  }
`;
