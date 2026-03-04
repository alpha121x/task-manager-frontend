<template>
  <div class="space-y-2 reveal-up">
    <label :for="id" class="text-sm font-semibold text-slate-700">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string
  label: string
  modelValue: string
  type: 'email' | 'password' | 'text'
  placeholder: string
  autocomplete?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>
