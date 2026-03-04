<template>
  <button
    :type="type"
    :disabled="disabled"
    class="w-full rounded-xl bg-gradient-to-r from-emerald-700 to-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    disabled: false
  }
)
</script>
