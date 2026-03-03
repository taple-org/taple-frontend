// fields/registry.ts
type FieldConfig = {
  component: Component
  passthrough?: Array<keyof FieldWrapperProps> // какие wrapper-пропсы идут в компонент
}

export const fieldRegistry: Record<string, FieldConfig> = {
  text:     { component: TextField },
  email:    { component: TextField },
  password: { component: TextField },
  checkbox: { component: CheckboxField, passthrough: ['label'] },
  // например radio тоже захочет label и hint
  radio:    { component: RadioField,    passthrough: ['label', 'hint'] },
}