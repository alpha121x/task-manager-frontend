import type { FormFieldSchema } from '~/modules/shared/types/form'

export const loginSchema: FormFieldSchema[] = [
  {
    key: 'email',
    type: 'email',
    labelKey: 'auth.fields.email.label',
    placeholderKey: 'auth.fields.email.placeholder',
    autocomplete: 'email'
  },
  {
    key: 'password',
    type: 'password',
    labelKey: 'auth.fields.password.label',
    placeholderKey: 'auth.fields.password.placeholder',
    autocomplete: 'current-password'
  }
]
