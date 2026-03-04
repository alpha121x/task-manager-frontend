import { gql } from '@apollo/client/core'

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
      description
      status
      priority
      dueDate
      assignedTo {
        id
        name
        email
      }
      team {
        id
        name
      }
    }
  }
`
