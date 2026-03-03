// fields/registry.ts
import TextField from './TextField.vue'
import CheckBoxField from './CheckboxField.vue'
import type { FieldWrapperProps } from '../FormField.vue'

type FieldConfig = {
  component: Component
  passthrough?: Array<keyof FieldWrapperProps> 
}

export const fieldRegistry: Record<string, FieldConfig> = {
  text:     { component: TextField },
  email:    { component: TextField },
  password: { component: TextField },
  checkbox: { component: CheckBoxField, passthrough: ['label'] },
}