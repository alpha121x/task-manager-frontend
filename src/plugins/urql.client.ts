import { defineNuxtPlugin } from '#app'
import { createClient, defaultExchanges } from '@urql/vue'

export default defineNuxtPlugin((nuxtApp) => {
  const client = createClient({
    url: 'http://localhost:4000/graphql',
    exchanges: defaultExchanges,
  })

  // 👇 THIS is what actually provides $urql
  nuxtApp.vueApp.provide('$urql', client)
})
