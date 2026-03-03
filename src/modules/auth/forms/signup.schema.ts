import type { FormFieldSchema } from '~/modules/shared/types/form'

export const signupSchema: FormFieldSchema[] = [
  {
    key: 'name',
    type: 'text',
    labelKey: 'auth.fields.name.label',
    placeholderKey: 'auth.fields.name.placeholder',
    autocomplete: 'name'
  },
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
    autocomplete: 'new-password'
  }
]
