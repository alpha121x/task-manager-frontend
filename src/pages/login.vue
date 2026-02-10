<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-xl shadow">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>

      <form @submit.prevent="login" class="space-y-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full border rounded px-3 py-2"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="errorMsg" class="text-red-600 text-sm">
          {{ errorMsg }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@urql/vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

// These will be assigned AFTER mount
let executeMutation: any = null

const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

// 🔑 THIS IS THE FIX
onMounted(() => {
  const mutation = useMutation(LOGIN_MUTATION)
  executeMutation = mutation.executeMutation
})

// Called on form submit
const login = async () => {
  if (!executeMutation) return

  loading.value = true
  errorMsg.value = null

  try {
    const result = await executeMutation({
      email: email.value,
      password: password.value,
    })

    const token = result?.data?.login?.token
    if (token) {
      localStorage.setItem('token', token)
      router.push('/dashboard')
    } else {
      errorMsg.value = 'Invalid credentials'
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
