import { gql } from '@urql/vue'

export const GetTeamsQuery = gql`
  query GetTeams {
    getTeams {
      id
      name
      description
      members {
        id
        name
        email
      }
    }
  }
`

export const GetTasksQuery = gql`
  query GetTasks($teamId: ID!) {
    getTasks(teamId: $teamId) {
      id
      title
      status
      priority
      dueDate
      assignedTo {
        name
      }
    }
  }
`