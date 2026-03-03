<script lang="ts" setup>
const { variant = "fill", disabled } = defineProps<{
  variant?: "fill" | "outline",
  disabled?: boolean,
}>()
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
<template>
  <button class="button"
          :class="[variant, { disabled: disabled }]"
          :disabled="disabled"
          :aria-disabled="disabled"
          @click="(e) => !disabled && emit('click', e)"
  >
    <slot />
  </button>
</template>
<style scoped lang="scss">
@use "~/assets/css/global" as global;
@use "sass:map";
@use "sass:color";


$primary: map.get(global.$colors, primary);
$secondary: map.get(global.$colors, secondary);
$neutral-lm: map.get(global.$colors, neutral-lm);
$neutral-ld: map.get(global.$colors, neutral-ld);

$btn-pb: 12px;
$btn-pi: 16px;
$btn-br: 12px;
$btn-fs: 14px;
$transition: 180ms ease;

.button {
  font-family: "StyreneALC", sans-serif;
  font-weight: 700;
  font-size: $btn-fs;

  padding-block: $btn-pb;
  padding-inline: $btn-pi;

  border: 1px solid $primary;
  border-radius: $btn-br;

  cursor: pointer;
  transition: background-color $transition, border-color $transition, color $transition;

}

.button.fill {
  background-color: $primary;
  color: $secondary;

  &:hover:not(:disabled) {
    background-color: color.adjust($primary, $lightness: 10%);
    border-color: color.adjust($primary, $lightness: 10%);
  }
}

.button.outline {
  background-color: $secondary;
  border-color: $primary;
  color: $primary;

  &:hover:not(:disabled) {
    background-color: $primary;
    color: $secondary;
  }
}

.button.disabled {
  background-color: $neutral-lm;
  border-color: $neutral-lm;
  color: $neutral-ld;
  cursor: not-allowed;
}
</style>