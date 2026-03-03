export type FormFieldType = 'email' | 'password' | 'text'

export interface FormFieldSchema {
  key: string
  type: FormFieldType
  labelKey: string
  placeholderKey: string
  autocomplete?: string
}
