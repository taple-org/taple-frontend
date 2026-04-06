<script setup lang="ts">
type LeadCardHeadProps = {
  score: number;
  title: string;
  subtitle: string;
  isNew: boolean;
};

defineProps<LeadCardHeadProps>();
</script>

<template>
  <div class="lead-card__head">
    <div class="lead-card__status-group">
      <span v-if="isNew" class="lead-card__status-tag">Новый</span>
      <span class="lead-card__score">{{ score }}</span>
    </div>

    <div class="lead-card__title-wrap">
      <h3 class="lead-card__title">{{ title }}</h3>
      <p class="lead-card__subtitle">{{ subtitle }}</p>
    </div>
  </div>
</template>

<style scoped>
.lead-card__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lead-card__status-group {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.lead-card__status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 12px;
  background: #298267;
  color: var(--color-neutral-ll);
  font-size: 10px;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.lead-card__score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 36px;
  padding: 10px;
  border-radius: 12px;
  background: #298267;
  color: var(--color-success-l);
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
}

.lead-card__title-wrap {
  min-width: 0;
}

.lead-card__title {
  margin: 0;
  color: var(--color-neutral-dd);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
}

.lead-card__subtitle {
  margin: 1px 0 0;
  color: #71727a;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.12px;
}

@media (max-width: 640px) {
  .lead-card__status-tag {
    padding-inline: 8px;
  }

  .lead-card__title {
    font-size: 13px;
  }
}
</style>
