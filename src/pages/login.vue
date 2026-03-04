<template>
  <div class="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-2">
    <section class="hidden md:block">
      <h1 class="mb-4 text-5xl font-bold text-slate-900">Ship Work Faster</h1>
      <p class="max-w-md text-base text-slate-600">
        Manage teams, track priorities, and keep delivery flow visible from one clean workspace.
      </p>
    </section>

    <AuthCard :title="t('auth.login.title')" :subtitle="t('auth.login.subtitle')">
      <FormEngine
        :schema="loginSchema"
        :model="form"
        :submit-label="isSubmitting ? t('auth.actions.loggingIn') : t('auth.actions.login')"
        :submitting="isSubmitting"
        :error-message="errorMsg"
        @submit="handleLogin"
        @update:model="updateField"
      />

      <p class="mt-5 text-sm text-slate-600">
        {{ t('auth.links.noAccount') }}
        <NuxtLink :to="routes.signup" class="font-semibold text-sky-800 hover:underline">
          {{ t('auth.actions.signup') }}
        </NuxtLink>
      </p>
    </AuthCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AuthCard from '~/modules/auth/components/AuthCard.vue'
import { loginSchema } from '~/modules/auth/forms/login.schema'
import { routes } from '~/modules/core/routes'
import FormEngine from '~/modules/shared/components/FormEngine.vue'
import { useGraphqlMutation } from '~/composables/useGraphQL'
import { LoginMutation } from '~/graphql/mutations/auth.mutation'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const router = useRouter()

const form = reactive({
  email: '',
  password: ''
})

const errorMsg = ref('')
const { mutate, loading } = useGraphqlMutation<{
  login: { token: string }
}, { input: { email: string; password: string } }>(LoginMutation)
const isSubmitting = computed(() => loading.value)

const handleLogin = async () => {
  errorMsg.value = ''

  try {
    const result = await mutate({
      input: {
        email: form.email,
        password: form.password
      }
    })

    const token = result?.data?.login?.token
    if (!token) {
      errorMsg.value = t('auth.errors.invalidCredentials')
      return
    }

    localStorage.setItem('token', token)
    router.push(routes.dashboard)
  } catch (error) {
    errorMsg.value = error instanceof Error ? error.message : t('common.errors.unknown')
  }
}

const updateField = (payload: { key: string; value: string }) => {
  form[payload.key as keyof typeof form] = payload.value
}
</script>
