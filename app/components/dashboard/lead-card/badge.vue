<script setup lang="ts">
type LeadCardBadgeProps = {
  variant: 'tag' | 'score';
  label: string;
};

defineProps<LeadCardBadgeProps>();
</script>

<template>
  <span :class="['lead-card-badge', `lead-card-badge--${variant}`]">
    {{ label }}
  </span>
</template>

<style scoped>
.lead-card-badge {
  display: flex;
  height: 36px;
  padding: 0px 8px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 10px;
  background: #298267;
  color:  #ffffff;
  font-weight: 700;
  width: fit-content;
}

.lead-card-badge--tag {
  font-size: 10px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.lead-card-badge--score {
  font-size: 14px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
</style>
