import { gql } from '@apollo/client';

const LOCATION_FRAGMENT = gql`
  fragment LocationFields on Location {
    id
    name
    updated_at
    deleted
    ranch {
      id
      name
    }
  }
`;

export const GET_LOCATIONS = gql`
  ${LOCATION_FRAGMENT}
  query GetLocations {
    locations {
      ...LocationFields
    }
  }
`;

export const GET_PUBLIC_CITIES = gql`
  ${LOCATION_FRAGMENT}
  query GetPublicCities {
    publicCities {
      ...LocationFields
    }
  }
`;

export const GET_LOCATION = gql`
  ${LOCATION_FRAGMENT}
  query GetLocation($id: ID!) {
    location(id: $id) {
      ...LocationFields
    }
  }
`;

export const CREATE_LOCATION = gql`
  ${LOCATION_FRAGMENT}
  mutation CreateLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      ...LocationFields
    }
  }
`;

export const UPDATE_LOCATION = gql`
  ${LOCATION_FRAGMENT}
  mutation UpdateLocation($id: ID!, $input: UpdateLocationInput!) {
    updateLocation(id: $id, input: $input) {
      ...LocationFields
    }
  }
`;

export const DELETE_LOCATION = gql`
  ${LOCATION_FRAGMENT}
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id) {
      ...LocationFields
    }
  }
`;
