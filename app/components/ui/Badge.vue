<template>
    <span class="badge" :class="[variant, size]">
        <slot />
    </span>
</template>

<script lang="ts" setup>
const { variant = 'primary', size = 'md' } = defineProps<{
    variant?: 'primary', size?: 'sm' | 'md' | 'lg'
}>();
</script>

<style scoped>
.badge {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 100px;
}
.sm{
  font-size: 9px;
   padding: 6px 8px;
  font-weight: bold;

}
.md{
  font-size: 14px;
   padding: 6px 12px;
  font-weight: bold;

}
.lg{
  font-size: 16px;
   padding: 6px 16px;
}
.primary {
    background-color: var(--color-highlight-l);
    color: var(--color-primary);
}
</style>