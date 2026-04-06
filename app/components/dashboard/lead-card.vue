<script setup lang="ts">
import LeadCardActions from "./lead-card/actions.vue";
import LeadCardDetails from "./lead-card/details.vue";
import LeadCardHead from "./lead-card/head.vue";
import LeadCardTags from "./lead-card/tags.vue";

type LeadCardProps = {
  score: number;
  title: string;
  subtitle: string;
  tags: string[];
  address: string;
  phone: string;
  openStatus: string;
  isNew?: boolean;
};

const {
  score,
  title,
  subtitle,
  tags,
  address,
  phone,
  openStatus,
  isNew = true,
} = defineProps<LeadCardProps>();

const emit = defineEmits<{
  postpone: [];
  take: [];
}>();
</script>

<template>
  <article class="lead-card" aria-label="Lead card">
    <LeadCardHead
      :score="score"
      :title="title"
      :subtitle="subtitle"
      :is-new="isNew"
    />

    <LeadCardTags :tags="tags" />

    <LeadCardDetails
      :address="address"
      :phone="phone"
      :open-status="openStatus"
    />

    <LeadCardActions @postpone="emit('postpone')" @take="emit('take')" />
  </article>
</template>

<style scoped>
.lead-card {
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding: 8px 16px;
  background: var(--color-neutral-ll);
  border-radius: 16px;
}

@media (max-width: 640px) {
  .lead-card {
    padding: 8px 10px;
  }
}
</style>
