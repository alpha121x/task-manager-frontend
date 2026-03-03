import { createI18n } from 'vue-i18n'
import enCommon from '~/translations/en/common.json'
import enAuth from '~/translations/en/auth.json'
import enDashboard from '~/translations/en/dashboard.json'
import arCommon from '~/translations/ar/common.json'
import arAuth from '~/translations/ar/auth.json'
import arDashboard from '~/translations/ar/dashboard.json'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard
      },
      ar: {
        common: arCommon,
        auth: arAuth,
        dashboard: arDashboard
      }
    }
  })
  vueApp.use(i18n)
})
