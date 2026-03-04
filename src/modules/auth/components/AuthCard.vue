<template>
  <div class="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-8 shadow-2xl shadow-slate-300/50 ring-1 ring-slate-200/70 backdrop-blur-sm">
    <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-sky-600" />
    <span class="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
      Team Workspace
    </span>
    <h1 class="mb-2 text-3xl font-bold leading-tight text-slate-900">{{ title }}</h1>
    <p class="mb-6 text-sm leading-6 text-slate-600">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>
