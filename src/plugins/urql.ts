import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { provideClient } from '@urql/vue'
import { Client, cacheExchange, fetchExchange } from '@urql/core'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const client = new Client({
    url: config.public.graphqlUrl,
    exchanges: [cacheExchange, fetchExchange],
  })

  provideClient(client)

  console.log('🔥 URQL READY')
})
