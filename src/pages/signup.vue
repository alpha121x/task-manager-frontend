<!-- src/pages/signup.vue -->
<template>
  <div style="padding: 20px; max-width: 400px; margin: 50px auto;">
    <h1>{{ $t('app.signup') }}</h1>

    <form @submit.prevent="handleSignup">
      <input
        v-model="name"
        :placeholder="$t('app.name')"
        required
        style="display:block; width:100%; margin:10px 0; padding:8px;"
      />
      <input
        v-model="email"
        :placeholder="$t('app.email')"
        type="email"
        required
        style="display:block; width:100%; margin:10px 0; padding:8px;"
      />
      <input
        v-model="password"
        :placeholder="$t('app.password')"
        type="password"
        minlength="6"
        required
        style="display:block; width:100%; margin:10px 0; padding:8px;"
      />
      <button
        type="submit"
        :disabled="loading"
        style="padding:10px 20px; background:#28a745; color:white; border:none; cursor:pointer;"
      >
        {{ loading ? 'Creating account...' : $t('app.signup') }}
      </button>
    </form>

    <!-- Language switcher -->
    <div style="margin-top: 20px;">
      <button @click="setLocale('en')" style="margin:5px;">EN</button>
      <button @click="setLocale('ar')" style="margin:5px;">AR</button>
    </div>

    <p style="margin-top: 20px;">
      Already have an account? <a href="/login" style="color:#007bff;">{{ $t('app.login') }}</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gql, useMutation } from '@urql/vue'
import { navigateTo } from '#imports'

// i18n
const { locale } = useI18n()
const setLocale = (lang: 'en' | 'ar') => {
  locale.value = lang
}

// Form state
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)

// GraphQL mutation
const SignupMutation = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`

// Handle signup
const handleSignup = async () => {
  loading.value = true
  try {
    const [result] = await useMutation(SignupMutation, {
      input: { name: name.value, email: email.value, password: password.value }
    })

    if (result.data?.signup) {
      localStorage.setItem('token', result.data.signup.token)
      navigateTo('/dashboard')
    } else {
      alert('Signup failed: ' + (result.error?.message || 'Invalid input'))
    }
  } finally {
    loading.value = false
  }
}
</script>