<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-8">
    <header class="glass-card reveal-up mb-6 rounded-3xl p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Team Management</p>
          <h1 class="text-3xl font-bold text-slate-900">Teams</h1>
          <p class="text-sm text-slate-600">Create teams and manage members for task assignment.</p>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink :to="routes.dashboard" class="rounded-lg border border-slate-300 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-800">
            Back to Dashboard
          </NuxtLink>
          <button class="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white" @click="logout">
            {{ t('common.actions.logout') }}
          </button>
        </div>
      </div>
    </header>

    <div class="grid gap-4 lg:grid-cols-3">
      <section class="glass-card reveal-up rounded-2xl p-4 lg:col-span-2">
        <h2 class="mb-4 text-lg font-semibold text-slate-900">Existing Teams</h2>

        <p v-if="teamsLoading" class="text-sm text-slate-600">{{ t('common.states.loading') }}</p>
        <p v-else-if="teamsError" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {{ teamsError }}
        </p>

        <div v-else class="space-y-3">
          <article v-for="team in teams" :key="team.id" class="rounded-xl border border-slate-200 bg-white/80 p-3">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 class="font-semibold text-slate-900">{{ team.name }}</h3>
                <p class="text-sm text-slate-600">{{ team.description || 'No description' }}</p>
              </div>
              <span class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-900">
                {{ team.members.length }} members
              </span>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="member in team.members"
                :key="member.id"
                class="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {{ member.name }}
              </span>
            </div>
          </article>

          <p v-if="!teams.length" class="text-sm text-slate-600">No teams yet. Create your first team from the form.</p>
        </div>
      </section>

      <section class="glass-card reveal-up rounded-2xl p-4">
        <h2 class="mb-3 text-lg font-semibold text-slate-900">Create Team</h2>

        <form class="space-y-3" @submit.prevent="createTeam">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Team Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            >
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Extra Member IDs (optional)</label>
            <input
              v-model="form.extraMemberIds"
              type="text"
              placeholder="id1,id2,id3"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            >
            <p class="mt-1 text-xs text-slate-600">Your own user will always be added automatically.</p>
          </div>

          <p v-if="formError" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ formError }}
          </p>

          <button
            type="submit"
            :disabled="createLoading"
            class="w-full rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ createLoading ? 'Creating...' : 'Create Team' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGraphqlMutation, useGraphqlQuery } from '~/composables/useGraphQL'
import { CreateTeamMutation } from '~/graphql/mutations/dashboard.mutation'
import { GetMeQuery, GetTeamsQuery } from '~/graphql/querries/dashboard.query'
import { routes } from '~/modules/core/routes'

definePageMeta({
  middleware: 'auth'
})

type TeamMember = {
  id: string
  name: string
  email: string
}

type Team = {
  id: string
  name: string
  description?: string
  members: TeamMember[]
}

const { t } = useI18n()

const logout = () => {
  localStorage.removeItem('token')
  navigateTo(routes.login)
}

const form = reactive({
  name: '',
  description: '',
  extraMemberIds: ''
})

const formError = ref('')

const {
  result: teamsResult,
  loading: teamsLoading,
  error: teamsQueryError,
  refetch: refetchTeams
} = useGraphqlQuery<{ getTeams: Team[] }>(GetTeamsQuery)

const { result: meResult } = useGraphqlQuery<{ me: { id: string } | null }>(GetMeQuery)

const { mutate, loading: createLoading } = useGraphqlMutation<
  { createTeam: { team: { id: string; name: string } } },
  { input: { name: string; description?: string; memberIds: string[] } }
>(CreateTeamMutation)

const teams = computed(() => teamsResult.value?.getTeams ?? [])
const teamsError = computed(() => teamsQueryError.value?.message ?? '')

const createTeam = async () => {
  formError.value = ''

  if (!form.name.trim()) {
    formError.value = 'Team name is required.'
    return
  }

  const meId = meResult.value?.me?.id
  if (!meId) {
    formError.value = 'Could not load current user. Please login again.'
    return
  }

  const extraIds = form.extraMemberIds
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)

  const memberIds = Array.from(new Set([meId, ...extraIds]))

  try {
    await mutate({
      input: {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        memberIds
      }
    })

    form.name = ''
    form.description = ''
    form.extraMemberIds = ''
    await refetchTeams()
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Failed to create team'
  }
}
</script>
