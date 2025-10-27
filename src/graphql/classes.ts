import { gql } from '@apollo/client';

const CLASS_FRAGMENT = gql`
  fragment ClassFields on Class {
    id
    date
    mapsLink
    active
    updated_at
    deleted
    location {
      id
      name
    }
  }
`;

export const GET_CLASSES = gql`
  ${CLASS_FRAGMENT}
  query GetClasses {
    classes {
      ...ClassFields
    }
  }
`;

export const GET_ACTIVE_CLASSES = gql`
  ${CLASS_FRAGMENT}
  query GetActiveClasses {
    activeClasses {
      ...ClassFields
    }
  }
`;

export const GET_CLASS = gql`
  ${CLASS_FRAGMENT}
  query GetClass($id: ID!) {
    class(id: $id) {
      ...ClassFields
    }
  }
`;

export const CREATE_CLASS = gql`
  ${CLASS_FRAGMENT}
  mutation CreateClass($input: CreateClassInput!) {
    createClass(input: $input) {
      ...ClassFields
    }
  }
`;

export const UPDATE_CLASS = gql`
  ${CLASS_FRAGMENT}
  mutation UpdateClass($id: ID!, $input: UpdateClassInput!) {
    updateClass(id: $id, input: $input) {
      ...ClassFields
    }
  }
`;

export const DELETE_CLASS = gql`
  ${CLASS_FRAGMENT}
  mutation DeleteClass($id: ID!) {
    deleteClass(id: $id) {
      ...ClassFields
    }
  }
`;
