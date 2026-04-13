<script setup lang="ts">
import LeadCardActions from "../lead-card/actions.vue";
import LeadCardDetails from "../lead-card/details.vue";
import LeadCardHead from "../lead-card/head.vue";
import LeadCardTags from "../lead-card/tags.vue";

type LeadCardProps = {
  score: number;
  title: string;
  subtitle: string;
  tags: string[];
  address: string;
  phone: string;
  openStatus: string;
  isNew?: boolean;
  leadId: string;
};

const props = defineProps<LeadCardProps>();

const emit = defineEmits<{
  postpone: [leadId: string];
  take: [leadId: string];
  hover: [leadId: string];
  leave: [];
  details: [leadId: string];
}>();

const isLoading = ref(false);
const shouldShake = ref(false);

const handlePostpone = () => {
  isLoading.value = true;
  shouldShake.value = false;
  emit('postpone', props.leadId);
};

const handleTake = () => {
  isLoading.value = true;
  shouldShake.value = false;
  emit('take', props.leadId);
};

const triggerShake = () => {
  isLoading.value = false;
  shouldShake.value = true;
  setTimeout(() => {
    shouldShake.value = false;
  }, 500);
};

defineExpose({
  triggerShake,
});
</script>

<template>
  <article 
    class="lead-card" 
    :class="{ 'lead-card--shake': shouldShake }" 
    aria-label="Lead card" 
    @mouseenter="emit('hover', leadId)"
    @mouseleave="emit('leave')"
    @click="emit('details', leadId)"
  >
    <LeadCardHead
      :score="score"
      :title="title"
      :subtitle="subtitle"
      :status="openStatus"
      :is-new="isNew"
    />

    <LeadCardTags :tags="tags" />

    <LeadCardDetails
      :address="address"
      :phone="phone"
      :open-status="openStatus"
    />

    <LeadCardActions 
      :loading="isLoading"
      @postpone="handlePostpone" 
      @take="handleTake" 
    />
  </article>
</template>

<style scoped>
.lead-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100%;
  padding: 8px 16px;
  background: var(--color-neutral-ll);
  border-radius: 16px;
  transition: box-shadow 0.3s ease;
}

.lead-card--shake {
  animation: shake 0.5s ease-in-out;
}
.lead-card:hover{
  cursor: pointer;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-8px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(8px);
  }
}

@media (max-width: 640px) {
  .lead-card {
    padding: 8px 10px;
  }
}
</style>
