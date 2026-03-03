<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-emerald-50 to-cyan-100 px-4">
    <AuthCard :title="t('auth.signup.title')" :subtitle="t('auth.signup.subtitle')">
      <FormEngine
        :schema="signupSchema"
        :model="form"
        :submit-label="loading ? t('auth.actions.creating') : t('auth.actions.signup')"
        :submitting="loading"
        :error-message="errorMsg"
        @submit="handleSignup"
        @update:model="updateField"
      />

      <p class="mt-5 text-sm text-slate-600">
        {{ t('auth.links.hasAccount') }}
        <NuxtLink :to="routes.login" class="font-semibold text-emerald-700 hover:underline">
          {{ t('auth.actions.login') }}
        </NuxtLink>
      </p>
    </AuthCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AuthCard from '~/modules/auth/components/AuthCard.vue'
import { signupSchema } from '~/modules/auth/forms/signup.schema'
import { routes } from '~/modules/core/routes'
import FormEngine from '~/modules/shared/components/FormEngine.vue'
import { useGraphqlMutation } from '~/composables/useGraphQL'
import { SignupMutation } from '~/graphql/mutations/auth.mutation'

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const errorMsg = ref('')
const { mutate, loading } = useGraphqlMutation<
  { signup: { token: string } },
  { input: { name: string; email: string; password: string } }
>(SignupMutation)

const handleSignup = async () => {
  errorMsg.value = ''

  try {
    const result = await mutate({
      input: {
        name: form.name,
        email: form.email,
        password: form.password
      }
    })

    const token = result?.data?.signup?.token
    if (!token) {
      errorMsg.value = t('auth.errors.signupFailed')
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
