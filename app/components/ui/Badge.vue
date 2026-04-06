<template>
    <span class="badge" :class="variant">
        <slot />
    </span>
</template>

<script lang="ts" setup>
const { variant = 'primary' } = defineProps<{
    variant?: 'primary'
}>();
</script>

<style scoped>
.badge {
    display: inline-block;
    font-size: 14px;
    font-weight: bold;
    padding: 6px 12px;
    border-radius: 100px;
}

.primary {
    background-color: var(--color-highlight-l);
    color: var(--color-primary);
}
</style>