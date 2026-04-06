<script setup lang="ts">
import DashboardLeadCard from "../lead-card.vue";
import type { Lead } from "./types";

defineProps<{
  leads: Lead[];
}>();

const emit = defineEmits<{
  postpone: [leadTitle: string];
  take: [leadTitle: string];
  showMore: [];
}>();
</script>

<template>
  <section class="leads-cards-list" aria-label="Список лидов">
    <DashboardLeadCard
      v-for="lead in leads"
      :key="lead.id"
      :score="lead.score"
      :title="lead.title"
      :subtitle="lead.subtitle"
      :tags="lead.tags"
      :address="lead.address"
      :phone="lead.phone"
      :open-status="lead.openStatus"
      @postpone="emit('postpone', lead.title)"
      @take="emit('take', lead.title)"
    />

    <button
      class="leads-cards-list__show-more"
      type="button"
      @click="emit('showMore')"
    >
      Показать еще
      <Icon name="other-arrow-down" mode="svg" :size="10" />
    </button>
  </section>
</template>

<style scoped>
.leads-cards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  min-height: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.leads-cards-list::-webkit-scrollbar {
  display: none;
}

.leads-cards-list__show-more {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  align-self: center;
  border: 0;
  padding: 6px 10px;
  background: transparent;
  color: var(--color-neutral-dm);
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
}

@media (max-width: 700px) {
  .leads-cards-list {
    max-width: 100%;
  }

  .leads-cards-list :deep(.lead-card) {
    max-width: 100%;
  }
}
</style>
