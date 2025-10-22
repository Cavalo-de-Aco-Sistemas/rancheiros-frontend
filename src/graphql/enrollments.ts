import { gql } from '@apollo/client';

const ENROLLMENT_FRAGMENT = gql`
  fragment EnrollmentFields on Enrollment {
    id
    name
    phone
    cnh
    uf_cnh
    email
    motorcycle_usage
    brand
    model
    status
    enrollment_date
    updated_at
    deleted
    preferred_city {
      id
      name
    }
    class {
      id
      date
      mapsLink
      active
      location {
        id
        name
      }
    }
  }
`;

export const GET_ENROLLMENTS = gql`
  ${ENROLLMENT_FRAGMENT}
  query GetEnrollments(
    $pagination: PaginationArgs
    $status: String
    $activeClassesOnly: Boolean
    $filter_name: String
    $filter_phone: String
    $filter_email: String
    $filter_preferred_city: String
    $filter_enrollment_date: String
    $filter_class: String
  ) {
    enrollments(
      pagination: $pagination
      status: $status
      activeClassesOnly: $activeClassesOnly
      filter_name: $filter_name
      filter_phone: $filter_phone
      filter_email: $filter_email
      filter_preferred_city: $filter_preferred_city
      filter_enrollment_date: $filter_enrollment_date
      filter_class: $filter_class
    ) {
      data {
        ...EnrollmentFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_ENROLLMENT = gql`
  ${ENROLLMENT_FRAGMENT}
  query GetEnrollment($id: ID!) {
    enrollment(id: $id) {
      ...EnrollmentFields
    }
  }
`;

export const GET_CONFIRMED_ENROLLMENTS_BY_CLASS = gql`
  ${ENROLLMENT_FRAGMENT}
  query GetConfirmedEnrollmentsByClass($classId: ID!) {
    confirmedEnrollmentsByClass(classId: $classId) {
      ...EnrollmentFields
    }
  }
`;

export const CREATE_PUBLIC_ENROLLMENT = gql`
  mutation CreatePublicEnrollment($input: CreateEnrollmentInput!) {
    createPublicEnrollment(input: $input) {
      message
      enrollmentId
    }
  }
`;

export const CREATE_ENROLLMENT = gql`
  ${ENROLLMENT_FRAGMENT}
  mutation CreateEnrollment($input: CreateEnrollmentInput!) {
    createEnrollment(input: $input) {
      ...EnrollmentFields
    }
  }
`;

export const UPDATE_ENROLLMENT = gql`
  ${ENROLLMENT_FRAGMENT}
  mutation UpdateEnrollment($id: ID!, $input: UpdateEnrollmentInput!) {
    updateEnrollment(id: $id, input: $input) {
      ...EnrollmentFields
    }
  }
`;

export const UPDATE_ENROLLMENT_STATUS = gql`
  ${ENROLLMENT_FRAGMENT}
  mutation UpdateEnrollmentStatus($id: ID!, $input: UpdateStatusInput!) {
    updateEnrollmentStatus(id: $id, input: $input) {
      ...EnrollmentFields
    }
  }
`;

export const ASSIGN_CLASS_TO_ENROLLMENT = gql`
  ${ENROLLMENT_FRAGMENT}
  mutation AssignClassToEnrollment($id: ID!, $input: AssignClassInput!) {
    assignClassToEnrollment(id: $id, input: $input) {
      ...EnrollmentFields
    }
  }
`;

export const DELETE_ENROLLMENT = gql`
  ${ENROLLMENT_FRAGMENT}
  mutation DeleteEnrollment($id: ID!) {
    deleteEnrollment(id: $id) {
      ...EnrollmentFields
    }
  }
`;

export const GET_CALL_MANAGEMENT_ENROLLMENTS = gql`
  ${ENROLLMENT_FRAGMENT}
  query GetCallManagementEnrollments(
    $pagination: PaginationArgs
    $activeClassesOnly: Boolean
    $filter_name: String
    $filter_phone: String
    $filter_email: String
    $filter_preferred_city: String
    $filter_enrollment_date: String
    $filter_class: String
  ) {
    enrollments(
      pagination: $pagination
      activeClassesOnly: $activeClassesOnly
      filter_name: $filter_name
      filter_phone: $filter_phone
      filter_email: $filter_email
      filter_preferred_city: $filter_preferred_city
      filter_enrollment_date: $filter_enrollment_date
      filter_class: $filter_class
    ) {
      data {
        ...EnrollmentFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_CERTIFICATION_ENROLLMENTS = gql`
  ${ENROLLMENT_FRAGMENT}
  query GetCertificationEnrollments(
    $pagination: PaginationArgs
    $activeClassesOnly: Boolean
    $filter_name: String
    $filter_phone: String
    $filter_email: String
    $filter_preferred_city: String
    $filter_enrollment_date: String
    $filter_class: String
  ) {
    enrollments(
      pagination: $pagination
      status: "CONFIRMED"
      activeClassesOnly: $activeClassesOnly
      filter_name: $filter_name
      filter_phone: $filter_phone
      filter_email: $filter_email
      filter_preferred_city: $filter_preferred_city
      filter_enrollment_date: $filter_enrollment_date
      filter_class: $filter_class
    ) {
      data {
        ...EnrollmentFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

