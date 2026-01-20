<template>
  <ClientOnly>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
      <h1 class="text-2xl font-bold text-center mb-6">Create Account</h1>

      <form @submit.prevent="signup" class="space-y-4">
        <input
          v-model="name"
          type="text"
          placeholder="Full Name"
          class="w-full border rounded-lg px-3 py-2"
          required
        />

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
          class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          :disabled="fetching"
        >
          {{ fetching ? 'Creating...' : 'Sign Up' }}
        </button>

        <p v-if="error" class="text-red-600 text-sm">
          {{ error.message }}
        </p>
      </form>

      <p class="text-sm text-center mt-4">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:underline">
          Login
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

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

const SIGNUP_MUTATION = `
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
    }
  }
`

const { executeMutation, fetching, error, data } =
  useMutation(SIGNUP_MUTATION)

const signup = async () => {
  await executeMutation({
    name: name.value,
    email: email.value,
    password: password.value,
  })
}

watch(data, (val) => {
  if (val?.signup?.id) {
    router.push('/login')
  }
})
</script>
