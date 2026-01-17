<!-- src/pages/login.vue -->
<template>
  <div style="padding: 20px; max-width: 400px; margin: 50px auto;">
    <h1>{{ $t('app.login') }}</h1>
    
    <form @submit.prevent="handleLogin">
      <input 
        v-model="email" 
        :placeholder="$t('app.email')" 
        required 
        style="display:block; width:100%; margin:10px 0; padding:8px;"
      />
      <input 
        v-model="password" 
        type="password" 
        :placeholder="$t('app.password')" 
        required 
        style="display:block; width:100%; margin:10px 0; padding:8px;"
      />
      <button type="submit" style="padding:10px 20px;">{{ $t('app.login') }}</button>
    </form>

    <!-- Language switcher -->
    <div style="margin-top: 20px;">
      <button @click="setLocale('en')" style="margin:5px;">EN</button>
      <button @click="setLocale('ar')" style="margin:5px;">AR</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gql, useMutation } from '@urql/vue'
import { navigateTo } from '#imports' // ✅ Add this

// i18n
const { locale } = useI18n()
const setLocale = (lang: 'en' | 'ar') => {
  locale.value = lang
}

// Form
const email = ref('')
const password = ref('')

// ✅ Define GraphQL mutation using gql tag
const LoginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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

// Login logic with real GraphQL
const handleLogin = async () => {
  const [result] = await useMutation(LoginMutation, {
    input: { email: email.value, password: password.value }
  })

  if (result.data?.login) {
    localStorage.setItem('token', result.data.login.token)
    navigateTo('/dashboard') // ✅ Now works!
  } else {
    alert('Login failed: ' + (result.error?.message || 'Unknown error'))
  }
}
</script>