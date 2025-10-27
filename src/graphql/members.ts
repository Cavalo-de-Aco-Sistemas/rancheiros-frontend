import { gql } from '@apollo/client';

const MEMBER_FRAGMENT = gql`
  fragment MemberFields on Member {
    id
    name
    patch
    blood
    phase
    birthday
    phone
    residence
    responsibility
    dateProspect
    dateHalfPatch
    dateFullPatch
    updated_at
    deleted
    ranch {
      id
      name
    }
    spouse {
      id
      name
    }
    godfather {
      id
      name
    }
  }
`;

export const GET_MEMBERS = gql`
  ${MEMBER_FRAGMENT}
  query GetMembers {
    members {
      ...MemberFields
    }
  }
`;

export const GET_MEMBER = gql`
  ${MEMBER_FRAGMENT}
  query GetMember($id: ID!) {
    member(id: $id) {
      ...MemberFields
    }
  }
`;

export const CREATE_MEMBER = gql`
  ${MEMBER_FRAGMENT}
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      ...MemberFields
    }
  }
`;

export const UPDATE_MEMBER = gql`
  ${MEMBER_FRAGMENT}
  mutation UpdateMember($id: ID!, $input: UpdateMemberInput!) {
    updateMember(id: $id, input: $input) {
      ...MemberFields
    }
  }
`;

export const DELETE_MEMBER = gql`
  ${MEMBER_FRAGMENT}
  mutation DeleteMember($id: ID!) {
    deleteMember(id: $id) {
      ...MemberFields
    }
  }
`;
