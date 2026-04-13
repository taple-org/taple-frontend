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
    <p v-if="address.length > 0" class="lead-card__detail-row">
      <Icon
        name="my-icon:location-pin"
        mode="svg"
        class="lead-card__detail-icon lead-card__detail-icon--location"
      />
      <span>{{ address }}</span>
    </p>

    <p v-if="phone.length > 0" class="lead-card__detail-row">
      <Icon
        name="my-icon:phone"
        mode="svg"
        class="lead-card__detail-icon"
      />
      <span>{{ phone }}</span>
    </p>

    <p v-if="openStatus.length > 0" class="lead-card__detail-row">
      <Icon
        name="my-icon:clock"
        mode="svg"
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
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.lead-card__detail-icon--location {
  transform: scale(0.9);
}
</style>
