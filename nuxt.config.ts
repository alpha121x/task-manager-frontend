// nuxt.config.ts
export default defineNuxtConfig({
  srcDir: 'src/',
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  typescript: { strict: true, shim: false },
  runtimeConfig: {
    public: {
      graphqlUrl: 'http://localhost:4000/graphql'
    }
  }
  // ✅ No i18n module here!
})