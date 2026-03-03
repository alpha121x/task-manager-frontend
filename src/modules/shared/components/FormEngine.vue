<template>
  <form class="space-y-4" @submit.prevent="$emit('submit')">
    <BaseInput
      v-for="field in schema"
      :id="field.key"
      :key="field.key"
      :label="t(field.labelKey)"
      :model-value="model[field.key] || ''"
      :type="field.type"
      :placeholder="t(field.placeholderKey)"
      :autocomplete="field.autocomplete"
      @update:model-value="$emit('update:model', { key: field.key, value: $event })"
    />

    <BaseButton type="submit" :disabled="submitting">
      {{ submitLabel }}
    </BaseButton>

    <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { FormFieldSchema } from '~/modules/shared/types/form'
import BaseButton from '~/modules/shared/components/BaseButton.vue'
import BaseInput from '~/modules/shared/components/BaseInput.vue'

defineProps<{
  schema: FormFieldSchema[]
  model: Record<string, string>
  submitLabel: string
  submitting: boolean
  errorMessage?: string
}>()

defineEmits<{
  (e: 'submit'): void
  (e: 'update:model', payload: { key: string; value: string }): void
}>()

const { t } = useI18n()
</script>
