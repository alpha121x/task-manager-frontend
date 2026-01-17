// src/composables/useGraphQL.ts
import { useAsyncQuery, useMutation } from '@urql/vue'
import type { DocumentNode } from 'graphql'

export function useGraphqlQuery(query: DocumentNode, variables?: any) {
  return useAsyncQuery(query, variables)
}

export function useGraphqlMutation(mutation: DocumentNode) {
  return useMutation(mutation)
}