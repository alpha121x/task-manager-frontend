import { gql } from '@apollo/client/core'

export const CreateTaskMutation = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      task {
        id
      }
    }
  }
`

export const UpdateTaskMutation = gql`
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      task {
        id
      }
    }
  }
`

export const DeleteTaskMutation = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`
