// src/plugins/urql.client.ts
import { createClient, fetchExchange, cacheExchange, provideClient } from '@urql/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  
  // Create URQL client
  const client = createClient({
    url: config.public.graphqlUrl,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => {
      const token = localStorage.getItem('token')
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      }
    },
  })

  // Provide client to Vue app
  nuxtApp.vueApp.use(provideClient(client))
})