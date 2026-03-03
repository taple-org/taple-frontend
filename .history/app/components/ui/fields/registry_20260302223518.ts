// fields/registry.ts
import TextField from './TextField.vue'
import CheckBoxField from './CheckboxField.vue'
import type { FieldWrapperProps } from '../FormField.vue'
type FieldConfig = {
  component: Component
  passthrough?: Array<keyof FieldWrapperProps> // какие wrapper-пропсы идут в компонент
}

export const fieldRegistry: Record<string, FieldConfig> = {
  text:     { component: TextField },
  email:    { component: TextField },
  password: { component: TextField },
  checkbox: { component: CheckBoxField, passthrough: ['label'] },
  // например radio тоже захочет label и hint
  radio:    { component: RadioField,    passthrough: ['label', 'hint'] },
}