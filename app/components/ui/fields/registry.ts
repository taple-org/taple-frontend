import TextField     from './TextField.vue'
import CheckBoxField from './CheckboxField.vue'
import PasswordField from './PasswordField.vue'
import SelectField   from './SelectField.vue'
import MultiSelectField from './MultiSelectField.vue'

import type { FieldWrapperProps } from '../FormField.vue'

type FieldConfig = {
  component: Component
  passthrough?: Array<keyof FieldWrapperProps>
}
export type SelectOption = { label: string; value: string }

export const fieldRegistry: Record<string, FieldConfig> = {
  text:     { component: TextField },
  email:    { component: TextField },
  password: { component: PasswordField },
  checkbox: { component: CheckBoxField, passthrough: ['label'] },
  select:   { component: SelectField },
  'multi-select': {
    component: MultiSelectField,
    passthrough: [],
  },
}