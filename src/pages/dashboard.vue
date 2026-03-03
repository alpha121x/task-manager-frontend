<template>
  <div class="mx-auto min-h-screen w-full max-w-6xl px-4 py-6">
    <header class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold text-slate-900">{{ t('common.brand.name') }} - {{ t('dashboard.title') }}</h1>
      <div class="flex items-center gap-2">
        <button class="rounded-md border px-3 py-1.5 text-sm" @click="setLocale('en')">EN</button>
        <button class="rounded-md border px-3 py-1.5 text-sm" @click="setLocale('ar')">AR</button>
        <button class="rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white" @click="logout">
          {{ t('common.actions.logout') }}
        </button>
      </div>
    </header>

    <section class="mb-8 rounded-xl border border-slate-200 bg-white p-4">
      <h2 class="mb-4 text-lg font-semibold">{{ t('dashboard.tasks.title') }}</h2>
      <p v-if="tasksLoading">{{ t('common.states.loading') }}</p>
      <ul v-else-if="tasks.length" class="space-y-3">
        <li v-for="task in tasks" :key="task.id" class="rounded-lg border border-slate-100 p-3">
          <p class="font-semibold">{{ task.title }}</p>
          <p class="text-sm text-slate-600">
            {{ task.status }} | {{ task.priority }}
          </p>
        </li>
      </ul>
      <p v-else>{{ t('dashboard.tasks.empty') }}</p>
    </section>

    <section class="rounded-xl border border-slate-200 bg-white p-4">
      <h2 class="mb-4 text-lg font-semibold">{{ t('dashboard.teams.title') }}</h2>
      <p v-if="teamsLoading">{{ t('common.states.loading') }}</p>
      <div v-else-if="teams.length" class="grid gap-3 md:grid-cols-2">
        <article
          v-for="team in teams"
          :key="team.id"
          class="rounded-lg border border-slate-100 p-3"
        >
          <h3 class="font-semibold">{{ team.name }}</h3>
          <p class="text-sm text-slate-600">{{ team.description || t('dashboard.teams.noDescription') }}</p>
        </article>
      </div>
      <p v-else>{{ t('dashboard.teams.empty') }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGraphqlQuery } from '~/composables/useGraphQL'
import { routes } from '~/modules/core/routes'
import { GetTasksQuery, GetTeamsQuery } from '~/graphql/querries/dashboard.query'

definePageMeta({
  middleware: 'auth'
})

const { locale, t } = useI18n()
const setLocale = (lang: 'en' | 'ar') => {
  locale.value = lang
}

const logout = () => {
  localStorage.removeItem('token')
  navigateTo(routes.login)
}

const { result: teamsResult, loading: teamsLoading } = useGraphqlQuery<{
  getTeams: Array<{ id: string; name: string; description?: string }>
}>(GetTeamsQuery)

const teams = computed(() => teamsResult.value?.getTeams ?? [])

const selectedTeamId = computed(() => teams.value[0]?.id || '')
const { result: tasksResult, loading: tasksLoading, refetch: refetchTasks } = useGraphqlQuery<{
  getTasks: Array<{ id: string; title: string; status: string; priority: string }>
}, { teamId: string }>(GetTasksQuery, { teamId: selectedTeamId.value })

watch(selectedTeamId, (teamId) => {
  if (teamId) {
    refetchTasks({ teamId })
  }
})

const tasks = computed(() => tasksResult.value?.getTasks ?? [])
</script>
