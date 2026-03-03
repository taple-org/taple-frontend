// fields/registry.ts
import TextField from './TextField.vue'
import CheckboxField from './CheckboxField.vue'

type FieldConfig = {
  component: Component
  inlineLabel?: boolean
  // сюда можно добавлять любые флаги по мере роста
}

export const fieldRegistry: Record<string, FieldConfig> = {
  text:     { component: TextField },
  email:    { component: TextField },
  password: { component: TextField },
  checkbox: { component: CheckboxField, inlineLabel: true },
}