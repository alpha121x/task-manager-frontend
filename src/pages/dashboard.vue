<!-- src/pages/dashboard.vue -->
<template>
  <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
    <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
      <h1>{{ $t('app.title') }} - Dashboard</h1>
      <div>
        <button @click="logout" style="margin-right:10px;">Logout</button>
        <button @click="setLocale('en')" style="margin:0 5px;">EN</button>
        <button @click="setLocale('ar')" style="margin:0 5px;">AR</button>
      </div>
    </header>

    <section style="margin-bottom:30px;">
      <h2>My Tasks</h2>
      <p v-if="fetchingTasks">Loading tasks...</p>
      <ul v-else-if="tasks.length">
        <li v-for="task in tasks" :key="task.id" style="padding:10px; border-bottom:1px solid #eee;">
          <strong>{{ task.title }}</strong> – {{ task.status }} ({{ task.priority }})
          <br />
          Assigned to: {{ task.assignedTo?.name || '—' }}
          <span v-if="task.dueDate"> | Due: {{ new Date(task.dueDate).toLocaleDateString() }}</span>
        </li>
      </ul>
      <p v-else>No tasks found.</p>
    </section>

    <section>
      <h2>Teams</h2>
      <p v-if="fetchingTeams">Loading teams...</p>
      <div v-else-if="teams.length" style="display:flex; gap:20px; flex-wrap:wrap;">
        <div
          v-for="team in teams"
          :key="team.id"
          style="border:1px solid #ccc; padding:15px; border-radius:8px; width:300px;"
        >
          <h3>{{ team.name }}</h3>
          <p>{{ team.description || 'No description' }}</p>
          <p><strong>Members:</strong></p>
          <ul>
            <li v-for="member in team.members" :key="member.id">{{ member.name }}</li>
          </ul>
        </div>
      </div>
      <p v-else>No teams found.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { gql, useQuery } from '@urql/vue'
import { navigateTo } from '#imports'

// i18n
const { locale } = useI18n()
const setLocale = (lang: 'en' | 'ar') => {
  locale.value = lang
}

// Logout
const logout = () => {
  localStorage.removeItem('token')
  navigateTo('/login')
}

// Fetch teams
const fetchingTeams = ref(true)
const teams = ref<any[]>([])

// Fetch tasks
const fetchingTasks = ref(true)
const tasks = ref<any[]>([])

// ✅ Named GraphQL queries (required for codegen)
const GetTeamsQuery = gql`
  query GetTeams {
    getTeams {
      id
      name
      description
      members {
        id
        name
        email
      }
    }
  }
`

const GetTasksQuery = gql`
  query GetTasks($teamId: ID!) {
    getTasks(teamId: $teamId) {
      id
      title
      status
      priority
      dueDate
      assignedTo {
        name
      }
    }
  }
`

onMounted(async () => {
  // Fetch teams
  const teamResult = await useQuery({ query: GetTeamsQuery }).toPromise()
  if (teamResult.data?.getTeams) {
    teams.value = teamResult.data.getTeams
  }
  fetchingTeams.value = false

  // Fetch tasks (use a mock team ID; in real app, pick from teams)
  const taskResult = await useQuery({
    query: GetTasksQuery,
    variables: { teamId: "1" }
  }).toPromise()

  if (taskResult.data?.getTasks) {
    tasks.value = taskResult.data.getTasks
  }
  fetchingTasks.value = false
})
</script>