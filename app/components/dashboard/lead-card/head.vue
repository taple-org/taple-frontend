<script setup lang="ts">
type LeadCardHeadProps = {
  score: number;
  title: string;
  subtitle: string;
  status: string;
  isNew: boolean;
};

defineProps<LeadCardHeadProps>();
</script>

<template>
  <div class="lead-card__head">
    <div class="lead-card__status-group">
      <dashboard-lead-card-badge variant="tag" :label="status" />
      <dashboard-lead-card-badge variant="score" :label="String(score)" />
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
  .lead-card__title {
    font-size: 13px;
  }
}
</style>
