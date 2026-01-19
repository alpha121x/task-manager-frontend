// plugins/i18n.ts
import { createI18n } from 'vue-i18n'
import en from '~/translations/en.json'
import ar from '~/translations/ar.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en, ar }
  })
  vueApp.use(i18n)
})