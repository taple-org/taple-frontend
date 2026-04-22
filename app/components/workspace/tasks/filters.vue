<script setup lang="ts">
import type { TaskBucket, TenantLeadTaskType } from "~/api/generated/api";
import { TASK_BUCKET_OPTIONS, TASK_FILTER_TYPE_OPTIONS } from "./model";

const buckets = defineModel<TaskBucket[]>("buckets", { required: true });
const taskTypes = defineModel<TenantLeadTaskType[]>("taskTypes", { required: true });
</script>

<template>
  <div class="filter">
    <ui-form-field
      class="filter__field"
      type="multi-select"
      v-model="buckets"
      :options="TASK_BUCKET_OPTIONS"
      placeholder="Какие таблицы показывать"
    />
    <ui-form-field
      class="filter__field"
      type="multi-select"
      v-model="taskTypes"
      :options="TASK_FILTER_TYPE_OPTIONS"
      placeholder="Какие типы задач показывать"
    />
  </div>
</template>

<style scoped>
.filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0 0 20px;
}

.filter__field {
  flex: 1 1 320px;
  max-width: 520px;
}
</style>
