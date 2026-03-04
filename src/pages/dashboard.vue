<template>
  <div class="mx-auto w-full max-w-6xl px-4 py-8">
    <header class="glass-card reveal-up mb-6 rounded-3xl p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Control Center</p>
          <h1 class="text-3xl font-bold text-slate-900">{{ t('dashboard.title') }}</h1>
          <p class="text-sm text-slate-600">{{ t('common.brand.name') }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="rounded-lg border border-slate-300 bg-white/80 px-3 py-1.5 text-sm font-medium" @click="setLocale('en')">EN</button>
          <button class="rounded-lg border border-slate-300 bg-white/80 px-3 py-1.5 text-sm font-medium" @click="setLocale('ar')">AR</button>
          <button class="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white" @click="logout">
            {{ t('common.actions.logout') }}
          </button>
        </div>
      </div>
    </header>

    <section class="mb-6 grid gap-3 sm:grid-cols-3">
      <article class="glass-card reveal-up rounded-2xl p-4">
        <p class="text-sm text-slate-600">Tasks</p>
        <p class="text-3xl font-bold text-slate-900">{{ tasks.length }}</p>
      </article>
      <article class="glass-card reveal-up rounded-2xl p-4">
        <p class="text-sm text-slate-600">Teams</p>
        <p class="text-3xl font-bold text-slate-900">{{ teams.length }}</p>
      </article>
      <article class="glass-card reveal-up rounded-2xl p-4">
        <p class="text-sm text-slate-600">Selected Team</p>
        <p class="truncate text-lg font-bold text-slate-900">{{ selectedTeamName }}</p>
      </article>
    </section>

    <div class="grid gap-4 lg:grid-cols-3">
      <section class="glass-card reveal-up rounded-2xl p-4 lg:col-span-2">
        <h2 class="mb-4 text-lg font-semibold text-slate-900">{{ t('dashboard.tasks.title') }}</h2>
        <p v-if="tasksLoading" class="text-sm text-slate-600">{{ t('common.states.loading') }}</p>
        <ul v-else-if="tasks.length" class="space-y-3">
          <li v-for="task in tasks" :key="task.id" class="rounded-xl border border-slate-200 bg-white/80 p-3">
            <div class="flex items-start justify-between gap-3">
              <p class="font-semibold text-slate-900">{{ task.title }}</p>
              <span class="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-900">
                {{ task.priority }}
              </span>
            </div>
            <p class="mt-1 text-xs uppercase tracking-wide text-slate-500">{{ task.status }}</p>
          </li>
        </ul>
        <p v-else class="text-sm text-slate-600">{{ t('dashboard.tasks.empty') }}</p>
      </section>

      <section class="glass-card reveal-up rounded-2xl p-4">
        <h2 class="mb-4 text-lg font-semibold text-slate-900">{{ t('dashboard.teams.title') }}</h2>
        <p v-if="teamsLoading" class="text-sm text-slate-600">{{ t('common.states.loading') }}</p>
        <ul v-else-if="teams.length" class="space-y-3">
          <li
            v-for="team in teams"
            :key="team.id"
            class="rounded-xl border border-slate-200 bg-white/80 p-3"
          >
            <p class="font-semibold text-slate-900">{{ team.name }}</p>
            <p class="text-sm text-slate-600">{{ team.description || t('dashboard.teams.noDescription') }}</p>
          </li>
        </ul>
        <p v-else class="text-sm text-slate-600">{{ t('dashboard.teams.empty') }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGraphqlQuery } from '~/composables/useGraphQL'
import { GetTasksQuery, GetTeamsQuery } from '~/graphql/querries/dashboard.query'
import { routes } from '~/modules/core/routes'

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
const selectedTeamName = computed(() => teams.value[0]?.name || '-')

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
