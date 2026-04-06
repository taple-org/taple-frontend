<script setup lang="ts">
const emit = defineEmits<{
  postpone: [];
  take: [];
}>();
</script>

<template>
  <div class="lead-card__actions">
    <button
      class="lead-card__action lead-card__action--postpone"
      type="button"
      @click="emit('postpone')"
    >
      Отложить
    </button>

    <span class="lead-card__divider" aria-hidden="true" />

    <button
      class="lead-card__action lead-card__action--take"
      type="button"
      @click="emit('take')"
    >
      Взять в работу
    </button>
  </div>
</template>

<style scoped>
.lead-card__actions {
  display: flex;
  align-items: stretch;
  width: 100%;
}

.lead-card__action {
  flex: 1;
  min-height: 34px;
  border: 0;
  font-family: var(--font-base), sans-serif;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.1;
  cursor: pointer;
  transition: filter var(--transition-base);
}

.lead-card__action:hover {
  filter: brightness(0.96);
}

.lead-card__action--postpone {
  border-radius: 100px 0 0 100px;
  background: var(--color-error);
  color: var(--color-error-l);
}

.lead-card__divider {
  width: 1px;
  background: var(--color-neutral-ld);
}

.lead-card__action--take {
  border-radius: 0 100px 100px 0;
  background: var(--color-highlight-d);
  color: var(--color-highlight-l);
}
</style>
