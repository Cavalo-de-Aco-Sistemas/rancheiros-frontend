import { gql } from '@apollo/client';

const RANCH_FRAGMENT = gql`
  fragment RanchFields on Ranch {
    id
    name
    updated_at
    deleted
  }
`;

export const GET_RANCHES = gql`
  ${RANCH_FRAGMENT}
  query GetRanches {
    ranches {
      ...RanchFields
    }
  }
`;

export const GET_RANCH = gql`
  ${RANCH_FRAGMENT}
  query GetRanch($id: ID!) {
    ranch(id: $id) {
      ...RanchFields
    }
  }
`;

export const CREATE_RANCH = gql`
  ${RANCH_FRAGMENT}
  mutation CreateRanch($input: CreateRanchInput!) {
    createRanch(input: $input) {
      ...RanchFields
    }
  }
`;

export const UPDATE_RANCH = gql`
  ${RANCH_FRAGMENT}
  mutation UpdateRanch($id: ID!, $input: UpdateRanchInput!) {
    updateRanch(id: $id, input: $input) {
      ...RanchFields
    }
  }
`;

export const DELETE_RANCH = gql`
  ${RANCH_FRAGMENT}
  mutation DeleteRanch($id: ID!) {
    deleteRanch(id: $id) {
      ...RanchFields
    }
  }
`;

