<script lang="ts" setup>
const attrs = useAttrs()
defineProps<{
    title: string,
    description: string
}>()
</script>
<template>
    <div class="completed">
        <div class="completed__icon-ring" v-bind="attrs">
            <slot />
        </div>
        <h2 class="completed__title">{{ title }}</h2>
        <p class="completed__description">{{ description }}</p>
    </div>
</template>
<style scoped>
.completed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 12px 8px;
  text-align: center;
}

.completed__icon-ring {
  color: var(--color-neutral-dl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.completed__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin: 0;
}

.completed__description {
  font-size: 13px;
  color: var(--color-neutral-dl);
  line-height: 1.6;
  max-width: 300px;
  margin: 0;
}
</style>