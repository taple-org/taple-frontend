<script setup lang="ts">
import DashboardLeadCard from "./lead-card.vue";
import type { Lead } from "./types";

defineProps<{
  leads: Lead[];
}>();

const emit = defineEmits<{
  postpone: [leadId: string];
  take: [leadId: string];
  showMore: [];
  hover: [leadId: string];
}>();

const cardRefs = ref<Record<string, InstanceType<typeof DashboardLeadCard>>>(
  {},
);

const setCardRef = (leadId: string, el: any) => {
  if (el) {
    cardRefs.value[leadId] = el;
  }
};

const triggerShake = (leadId: string) => {
  cardRefs.value[leadId]?.triggerShake();
};

defineExpose({
  triggerShake,
});
</script>

<template>
  <section class="leads-cards-list" aria-label="Список лидов">
    <TransitionGroup
      name="lead-card"
      tag="div"
      class="leads-cards-list__container"
    >
      <DashboardLeadCard
        v-for="lead in leads"
        :key="lead.id"
        :ref="(el) => setCardRef(lead.id, el)"
        :lead-id="lead.id"
        :score="lead.score"
        :title="lead.title"
        :subtitle="lead.subtitle"
        :tags="lead.tags"
        :address="lead.address"
        :phone="lead.phone"
        :open-status="lead.openStatus"
        @postpone="emit('postpone', $event)"
        @take="emit('take', $event)"
        @hover="emit('hover', $event)"
      />
    </TransitionGroup>

    <button
      class="leads-cards-list__show-more"
      type="button"
      @click="emit('showMore')"
    >
      Показать еще
      <Icon name="my-icon-arrow-down" mode="svg" :size="10" />
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

.leads-cards-list__container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Transition animations */
.lead-card-move {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lead-card-enter-active {
  z-index: -1;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lead-card-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.lead-card-leave-to {
  opacity: 0;
  transform: translateX(100%);
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
  .leads-cards-list :deep(.lead-card) {
    max-width: 100%;
  }
}
</style>
