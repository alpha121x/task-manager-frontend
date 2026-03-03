import { useMutation, useQuery } from '@vue/apollo-composable'
import type { OperationVariables } from '@apollo/client/core'
import type { DocumentNode } from 'graphql'

export function useGraphqlQuery<TData = unknown, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  variables?: TVariables
) {
  if (variables === undefined) {
    return useQuery<TData, TVariables>(query)
  }

  return useQuery<TData, TVariables>(query, variables)
}

export function useGraphqlMutation<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables
>(mutation: DocumentNode) {
  return useMutation<TData, TVariables>(mutation)
}
