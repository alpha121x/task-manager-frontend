<template>
  <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
    <span class="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
      Team Workspace
    </span>
    <h1 class="mb-2 text-3xl font-bold text-slate-900">{{ title }}</h1>
    <p class="mb-6 text-sm text-slate-600">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>
