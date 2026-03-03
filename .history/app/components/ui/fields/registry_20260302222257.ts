// fields/registry.ts
import TextField from './TextField.vue'
import CheckBoxField from './CheckBoxField.vue'

type FieldConfig = {
  component: Component
  inlineLabel?: boolean
}

export const fieldRegistry: Record<string, FieldConfig> = {
  text:     { component: TextField },
  email:    { component: TextField },
  password: { component: TextField },
  checkbox: { component: CheckBoxField, inlineLabel: true },
}