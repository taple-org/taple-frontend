<script setup lang="ts">
import type { TaskBucket } from "~/api/generated/api";
import { useWorkspaceMemberOptions } from "~/composables/workspace/useWorkspaceMemberOptions";
import { useI18n } from "vue-i18n";
import { getTaskBucketOptions } from "./model";

const { workspaceId } = defineProps<{
  workspaceId: string;
}>();

const search = defineModel<string>("search", { required: true });
const buckets = defineModel<TaskBucket[]>("buckets", { required: true });
const responsibleMemberId = defineModel<string>("responsibleMemberId", { required: true });
const assignedToMemberId = defineModel<string>("assignedToMemberId", { required: true });

const { options: memberOptions, pending: membersPending } = useWorkspaceMemberOptions(
  computed(() => workspaceId),
);
const { t } = useI18n();
const bucketOptions = computed(() => getTaskBucketOptions(t));
</script>

<template>
  <div class="filter">
    <ui-form-field
      class="filter__field filter__field--wide"
      type="text"
      v-model="search"
      :placeholder="t('tasks.searchPlaceholder')"
      :label="t('common.search')"
      icon-left="my-icon-search"
    />
    <ui-form-field
      class="filter__field"
      type="select"
      v-model="responsibleMemberId"
      :options="memberOptions"
      :disabled="membersPending"
      :label="t('tasks.responsibleLead')"
    />
    <ui-form-field
      class="filter__field"
      type="select"
      v-model="assignedToMemberId"
      :options="memberOptions"
      :disabled="membersPending"
      :label="t('tasks.taskPerformer')"
    />
    <ui-form-field
      class="filter__field"
      type="multi-select"
      v-model="buckets"
      :options="bucketOptions"
      :label="t('tasks.columns')"
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
  flex: 1 1 260px;
  max-width: 520px;
}

.filter__field--wide {
  flex-basis: 360px;
}
</style>
