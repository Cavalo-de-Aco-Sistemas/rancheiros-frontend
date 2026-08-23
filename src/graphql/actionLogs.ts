import { gql } from '@apollo/client';

const ACTION_LOG_FRAGMENT = gql`
  fragment ActionLogFields on ActionLog {
    id
    entity_name
    entity_id
    action
    changes
    created_at
    actor {
      id
      username
      name
    }
  }
`;

export const GET_ACTION_LOGS = gql`
  ${ACTION_LOG_FRAGMENT}
  query GetActionLogs($pagination: PaginationArgs) {
    actionLogs(pagination: $pagination) {
      data {
        ...ActionLogFields
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_ACTION_LOG_FAILURE_COUNT = gql`
  query GetActionLogFailureCount {
    actionLogFailureCount
  }
`;
