<template>
  <ClientOnly>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>

      <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border rounded-lg px-3 py-2"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border rounded-lg px-3 py-2"
          required
        />

        <button
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          :disabled="fetching"
        >
          {{ fetching ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="error" class="text-red-600 text-sm">
          {{ error.message }}
        </p>
      </form>

      <p class="text-sm text-center mt-4">
        Don’t have an account?
        <NuxtLink to="/signup" class="text-blue-600 hover:underline">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMutation } from '@urql/vue'
import { useRouter } from 'vue-router'

// 👇 Disable SSR for this page
definePageMeta({
  ssr: false
})

const router = useRouter()

const email = ref('')
const password = ref('')

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

const { executeMutation, fetching, error, data } =
  useMutation(LOGIN_MUTATION)

const login = async () => {
  await executeMutation({
    email: email.value,
    password: password.value,
  })
}

watch(data, (val) => {
  if (val?.login?.token) {
    localStorage.setItem('token', val.login.token)
    router.push('/dashboard')
  }
})
</script>
