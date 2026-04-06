<script setup lang="ts">
type LeadCardDetailsProps = {
  address: string;
  phone: string;
  openStatus: string;
};

defineProps<LeadCardDetailsProps>();
</script>

<template>
  <div class="lead-card__details">
    <p class="lead-card__detail-row">
      <Icon
        name="other-icon-location-pin"
        mode="svg"
        :size="15"
        class="lead-card__detail-icon lead-card__detail-icon--location"
      />
      <span>{{ address }}</span>
    </p>

    <p class="lead-card__detail-row">
      <Icon
        name="other-icon-phone"
        mode="svg"
        :size="15"
        class="lead-card__detail-icon"
      />
      <span>{{ phone }}</span>
    </p>

    <p class="lead-card__detail-row">
      <Icon
        name="other-icon-clock"
        mode="svg"
        :size="15"
        class="lead-card__detail-icon"
      />
      <span>{{ openStatus }}</span>
    </p>
  </div>
</template>

<style scoped>
.lead-card__details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.lead-card__detail-row {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #71727a;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lead-card__detail-icon {
  flex-shrink: 0;
}

.lead-card__detail-icon--location {
  transform: scale(0.9);
}
</style>
