import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createClient, VueUrql } from '@urql/vue'
import { cacheExchange, fetchExchange } from '@urql/core'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const client = createClient({
    url: config.public.graphqlUrl,
    exchanges: [cacheExchange, fetchExchange], // ⭐ THIS FIXES reduceRight
  })

  nuxtApp.vueApp.use(VueUrql, client)

  console.log('🔥 URQL INSTALLED CORRECTLY')
})
