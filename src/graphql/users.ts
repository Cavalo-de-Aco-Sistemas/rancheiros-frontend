import { gql } from '@apollo/client';

const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    username
    name
    super_admin
    updated_at
    deleted
    permissions {
      members { create read update delete }
      classes { create read update delete }
      users { create read update delete }
      enrollments { create read update delete }
      locations { create read update delete }
      ranches { create read update delete }
      flow { create read update delete }
    }
    ranches {
      id
      name
    }
  }
`;

export const GET_USERS = gql`
  ${USER_FRAGMENT}
  query GetUsers {
    users {
      ...UserFields
    }
  }
`;

export const GET_USER = gql`
  ${USER_FRAGMENT}
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
`;

export const CREATE_USER = gql`
  ${USER_FRAGMENT}
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
`;

export const UPDATE_USER = gql`
  ${USER_FRAGMENT}
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ...UserFields
    }
  }
`;

export const DELETE_USER = gql`
  ${USER_FRAGMENT}
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      ...UserFields
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  ${USER_FRAGMENT}
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      ...UserFields
    }
  }
`;

