<script setup lang="ts">

type LeadCardTagsProps = {
  tags: string[];
};

defineProps<LeadCardTagsProps>();
</script>

<template>
  <div class="lead-card__tags" aria-label="Lead services">
    <ui-badge v-for="tag in tags" :key="tag" size="sm" >
      {{ tag }}
    </ui-badge>
  </div>
</template>

<style scoped>
.lead-card__tags {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
}

.lead-card__tags::-webkit-scrollbar {
  display: none;
}

.lead-card__service-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: 12px;
  background: var(--color-highlight-l);
  color: var(--color-highlight-d);
  font-size: 6px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  white-space: nowrap;
}
</style>
