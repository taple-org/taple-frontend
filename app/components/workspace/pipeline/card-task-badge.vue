<template>
    <span class="badge" :class="[variant]">
        <slot />
    </span>
</template>

<script lang="ts" setup>
const { variant = 'primary'} = defineProps<{
    variant?: 'primary' | 'warning' | 'error' | 'success' | 'neutral',
}>();
</script>

<style scoped>
.badge {
    display: inline-block;
    text-align: right;
    font-family: var(--font-base), sans-serif;
    font-size: 8px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}

.primary {
    color: var(--color-primary, #006FFD);
}
.warning{
    color: var(--color-warning, #FFB37C);
}
.error{
    color: var(--color-error, #FF616D);
}
.success{
    color: var(--color-success, #3AC0A0);
}
.neutral{
    color: var(--color-neutral-dl, #71727A);
}
</style>
