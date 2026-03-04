<template>
  <div class="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-2">
    <section class="hidden md:block">
      <h1 class="mb-4 text-5xl font-bold text-slate-900">Create Your Team Hub</h1>
      <p class="max-w-md text-base text-slate-600">
        Sign up to organize tasks, track owners, and move work from backlog to done with clarity.
      </p>
    </section>

    <AuthCard :title="t('auth.signup.title')" :subtitle="t('auth.signup.subtitle')">
      <FormEngine
        :schema="signupSchema"
        :model="form"
        :submit-label="isSubmitting ? t('auth.actions.creating') : t('auth.actions.signup')"
        :submitting="isSubmitting"
        :error-message="errorMsg"
        @submit="handleSignup"
        @update:model="updateField"
      />

      <p class="mt-5 text-sm text-slate-600">
        {{ t('auth.links.hasAccount') }}
        <NuxtLink :to="routes.login" class="font-semibold text-emerald-800 hover:underline">
          {{ t('auth.actions.login') }}
        </NuxtLink>
      </p>
    </AuthCard>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
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
const isSubmitting = computed(() => loading.value)

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
