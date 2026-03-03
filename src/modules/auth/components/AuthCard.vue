<template>
  <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
    <h1 class="mb-2 text-2xl font-bold text-slate-900">{{ title }}</h1>
    <p class="mb-6 text-sm text-slate-500">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
}>()
</script>
