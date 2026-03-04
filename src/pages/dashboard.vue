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

    <section class="mb-6 grid gap-3 sm:grid-cols-4">
      <article class="glass-card reveal-up rounded-2xl p-4">
        <p class="text-sm text-slate-600">Total Tasks</p>
        <p class="text-3xl font-bold text-slate-900">{{ filteredTasks.length }}</p>
      </article>
      <article class="glass-card reveal-up rounded-2xl p-4">
        <p class="text-sm text-slate-600">To Do</p>
        <p class="text-3xl font-bold text-slate-900">{{ statusCounts.todo }}</p>
      </article>
      <article class="glass-card reveal-up rounded-2xl p-4">
        <p class="text-sm text-slate-600">In Progress</p>
        <p class="text-3xl font-bold text-slate-900">{{ statusCounts.in_progress }}</p>
      </article>
      <article class="glass-card reveal-up rounded-2xl p-4">
        <p class="text-sm text-slate-600">Done</p>
        <p class="text-3xl font-bold text-slate-900">{{ statusCounts.done }}</p>
      </article>
    </section>

    <div class="grid gap-4 lg:grid-cols-3">
      <section class="glass-card reveal-up rounded-2xl p-4 lg:col-span-2">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg font-semibold text-slate-900">Task Management</h2>
          <div class="w-full md:w-auto">
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Team</label>
            <select
              v-model="selectedTeamId"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 md:min-w-52"
            >
              <option v-for="team in teams" :key="team.id" :value="team.id">
                {{ team.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="mb-4 grid gap-3 md:grid-cols-4">
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by title"
            class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          >

          <select v-model="filters.status" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800">
            <option value="all">All status</option>
            <option v-for="option in statusOptions" :key="option" :value="option">{{ labelize(option) }}</option>
          </select>

          <select v-model="filters.priority" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800">
            <option value="all">All priority</option>
            <option v-for="option in priorityOptions" :key="option" :value="option">{{ labelize(option) }}</option>
          </select>

          <select v-model="filters.assigneeId" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800">
            <option value="all">All assignees</option>
            <option v-for="member in selectedTeamMembers" :key="member.id" :value="member.id">{{ member.name }}</option>
          </select>
        </div>

        <p v-if="tasksLoading" class="text-sm text-slate-600">{{ t('common.states.loading') }}</p>
        <p v-else-if="tasksErrorMsg" class="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {{ tasksErrorMsg }}
        </p>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full rounded-xl border border-slate-200 bg-white/85 text-sm">
            <thead class="bg-slate-100/80 text-slate-700">
              <tr>
                <th class="px-3 py-2 text-left font-semibold">Title</th>
                <th class="px-3 py-2 text-left font-semibold">Status</th>
                <th class="px-3 py-2 text-left font-semibold">Priority</th>
                <th class="px-3 py-2 text-left font-semibold">Assignee</th>
                <th class="px-3 py-2 text-left font-semibold">Due Date</th>
                <th class="px-3 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in filteredTasks" :key="task.id" class="border-t border-slate-200">
                <td class="px-3 py-2">
                  <p class="font-semibold text-slate-900">{{ task.title }}</p>
                  <p class="text-xs text-slate-600">{{ task.description || '-' }}</p>
                </td>
                <td class="px-3 py-2 text-slate-700">{{ labelize(task.status) }}</td>
                <td class="px-3 py-2 text-slate-700">{{ labelize(task.priority) }}</td>
                <td class="px-3 py-2 text-slate-700">{{ task.assignedTo.name }}</td>
                <td class="px-3 py-2 text-slate-700">{{ formatDate(task.dueDate) }}</td>
                <td class="px-3 py-2">
                  <div class="flex gap-2">
                    <button class="rounded-md border border-sky-300 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800" @click="startEdit(task)">Edit</button>
                    <button class="rounded-md border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800" @click="removeTask(task.id)">Delete</button>
                  </div>
                </td>
              </tr>
              <tr v-if="!filteredTasks.length">
                <td colspan="6" class="px-3 py-4 text-center text-sm text-slate-600">No tasks found for the selected filters.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="glass-card reveal-up rounded-2xl p-4">
        <h2 class="mb-3 text-lg font-semibold text-slate-900">
          {{ editingTaskId ? 'Edit Task' : 'Quick Create Task' }}
        </h2>

        <form class="space-y-3" @submit.prevent="submitTask">
          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
            <input
              v-model="taskForm.title"
              type="text"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            >
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
            <textarea
              v-model="taskForm.description"
              rows="3"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
              <select v-model="taskForm.status" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800">
                <option v-for="option in statusOptions" :key="option" :value="option">{{ labelize(option) }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</label>
              <select v-model="taskForm.priority" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800">
                <option v-for="option in priorityOptions" :key="option" :value="option">{{ labelize(option) }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Assignee</label>
            <select
              v-model="taskForm.assignedToId"
              required
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            >
              <option disabled value="">Select member</option>
              <option v-for="member in selectedTeamMembers" :key="member.id" :value="member.id">{{ member.name }}</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Due date</label>
            <input
              v-model="taskForm.dueDate"
              type="date"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
            >
          </div>

          <p v-if="formError" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ formError }}
          </p>

          <div class="flex gap-2">
            <button
              type="submit"
              :disabled="createLoading || updateLoading || !selectedTeamId"
              class="flex-1 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ createLoading || updateLoading ? 'Saving...' : editingTaskId ? 'Update Task' : 'Create Task' }}
            </button>
            <button
              v-if="editingTaskId"
              type="button"
              class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              @click="resetForm"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@vue/apollo-composable'
import { useGraphqlMutation, useGraphqlQuery } from '~/composables/useGraphQL'
import { DeleteTaskMutation, CreateTaskMutation, UpdateTaskMutation } from '~/graphql/mutations/dashboard.mutation'
import { GetTasksQuery, GetTeamsQuery } from '~/graphql/querries/dashboard.query'
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

type Task = {
  id: string
  title: string
  description?: string
  status: string
  priority: string
  dueDate?: string
  assignedTo: {
    id: string
    name: string
    email: string
  }
  team: {
    id: string
    name: string
  }
}

const { locale, t } = useI18n()
const setLocale = (lang: 'en' | 'ar') => {
  locale.value = lang
}

const logout = () => {
  localStorage.removeItem('token')
  navigateTo(routes.login)
}

const statusOptions = ['todo', 'in_progress', 'review', 'done'] as const
const priorityOptions = ['low', 'medium', 'high'] as const

const selectedTeamId = ref('')

const filters = reactive({
  search: '',
  status: 'all',
  priority: 'all',
  assigneeId: 'all'
})

const taskForm = reactive({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignedToId: '',
  dueDate: ''
})

const editingTaskId = ref('')
const formError = ref('')

const { result: teamsResult, loading: teamsLoading } = useGraphqlQuery<{ getTeams: Team[] }>(GetTeamsQuery)

const teams = computed(() => teamsResult.value?.getTeams ?? [])
const selectedTeam = computed(() => teams.value.find((team) => team.id === selectedTeamId.value) ?? null)
const selectedTeamMembers = computed(() => selectedTeam.value?.members ?? [])

watch(
  teams,
  (nextTeams) => {
    if (!selectedTeamId.value && nextTeams.length) {
      selectedTeamId.value = nextTeams[0].id
    }
  },
  { immediate: true }
)

watch(
  selectedTeamMembers,
  (members) => {
    if (!members.length) {
      taskForm.assignedToId = ''
      return
    }

    const hasCurrentAssignee = members.some((member) => member.id === taskForm.assignedToId)
    if (!hasCurrentAssignee && !editingTaskId.value) {
      taskForm.assignedToId = members[0].id
    }
  },
  { immediate: true }
)

const {
  result: tasksResult,
  loading: tasksLoading,
  error: tasksError,
  refetch: refetchTasks
} = useQuery<{ getTasks: Task[] }, { teamId: string }>(
  GetTasksQuery,
  () => ({ teamId: selectedTeamId.value }),
  () => ({
    enabled: Boolean(selectedTeamId.value)
  })
)

watch(selectedTeamId, () => {
  filters.assigneeId = 'all'
  if (selectedTeamId.value) {
    refetchTasks({ teamId: selectedTeamId.value })
  }
})

const tasks = computed(() => tasksResult.value?.getTasks ?? [])
const tasksErrorMsg = computed(() => tasksError.value?.message ?? '')

const normalizedTasks = computed(() => {
  return tasks.value.map((task) => ({
    ...task,
    status: task.status.replace('-', '_')
  }))
})

const filteredTasks = computed(() => {
  return normalizedTasks.value.filter((task) => {
    const matchSearch = !filters.search || task.title.toLowerCase().includes(filters.search.toLowerCase())
    const matchStatus = filters.status === 'all' || task.status === filters.status
    const matchPriority = filters.priority === 'all' || task.priority === filters.priority
    const matchAssignee = filters.assigneeId === 'all' || task.assignedTo.id === filters.assigneeId

    return matchSearch && matchStatus && matchPriority && matchAssignee
  })
})

const statusCounts = computed(() => {
  return filteredTasks.value.reduce(
    (acc, task) => {
      if (task.status in acc) {
        acc[task.status as keyof typeof acc] += 1
      }
      return acc
    },
    {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0
    }
  )
})

const { mutate: createTask, loading: createLoading } = useGraphqlMutation<
  { createTask: { task: { id: string } } },
  {
    input: {
      title: string
      description?: string
      status: string
      priority: string
      assignedToId: string
      teamId: string
      dueDate?: string
    }
  }
>(CreateTaskMutation)

const { mutate: updateTask, loading: updateLoading } = useGraphqlMutation<
  { updateTask: { task: { id: string } } },
  {
    input: {
      id: string
      title: string
      description?: string
      status: string
      priority: string
      assignedToId: string
      dueDate?: string
    }
  }
>(UpdateTaskMutation)

const { mutate: deleteTask } = useGraphqlMutation<{ deleteTask: boolean }, { id: string }>(DeleteTaskMutation)

const toApiStatus = (status: string) => (status === 'in_progress' ? 'in-progress' : status)

const resetForm = () => {
  editingTaskId.value = ''
  taskForm.title = ''
  taskForm.description = ''
  taskForm.status = 'todo'
  taskForm.priority = 'medium'
  taskForm.dueDate = ''
  taskForm.assignedToId = selectedTeamMembers.value[0]?.id ?? ''
  formError.value = ''
}

const submitTask = async () => {
  formError.value = ''

  if (!selectedTeamId.value) {
    formError.value = 'Select a team first.'
    return
  }

  if (!taskForm.title.trim()) {
    formError.value = 'Task title is required.'
    return
  }

  if (!taskForm.assignedToId) {
    formError.value = 'Task assignee is required.'
    return
  }

  const commonInput = {
    title: taskForm.title.trim(),
    description: taskForm.description.trim() || undefined,
    status: toApiStatus(taskForm.status),
    priority: taskForm.priority,
    assignedToId: taskForm.assignedToId,
    dueDate: taskForm.dueDate || undefined
  }

  try {
    if (editingTaskId.value) {
      await updateTask({
        input: {
          id: editingTaskId.value,
          ...commonInput
        }
      })
    } else {
      await createTask({
        input: {
          ...commonInput,
          teamId: selectedTeamId.value
        }
      })
    }

    await refetchTasks({ teamId: selectedTeamId.value })
    resetForm()
  } catch (error) {
    formError.value = error instanceof Error ? error.message : t('common.errors.unknown')
  }
}

const startEdit = (task: Task) => {
  editingTaskId.value = task.id
  taskForm.title = task.title
  taskForm.description = task.description || ''
  taskForm.status = task.status.replace('-', '_')
  taskForm.priority = task.priority
  taskForm.assignedToId = task.assignedTo.id
  taskForm.dueDate = task.dueDate ? task.dueDate.slice(0, 10) : ''
  formError.value = ''
}

const removeTask = async (id: string) => {
  formError.value = ''

  try {
    await deleteTask({ id })
    await refetchTasks({ teamId: selectedTeamId.value })

    if (editingTaskId.value === id) {
      resetForm()
    }
  } catch (error) {
    formError.value = error instanceof Error ? error.message : t('common.errors.unknown')
  }
}

const labelize = (value: string) => {
  return value
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const formatDate = (value?: string) => {
  if (!value) {
    return '-'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return '-'
  }

  return parsed.toLocaleDateString()
}

watch(teamsLoading, () => {
  if (!teamsLoading.value && selectedTeamId.value) {
    refetchTasks({ teamId: selectedTeamId.value })
  }
})
</script>
