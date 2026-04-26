<script setup lang="ts">
import type { WorkspaceMakeFlowStatus } from "~/composables/workspace/useWorkspaceMakeFlow";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{
  status: WorkspaceMakeFlowStatus;
  canNext: boolean;
  toNext: () => void;
  toPrevious: () => void;
  close: () => void;
  handleSubmit: () => void;
}>();
</script>
<template>
  <ui-button v-if="canNext" @click="toNext">
    {{ t("common.next") }}
  </ui-button>

  <template v-else>
    <ui-button v-if="status === 'idle'" @click="handleSubmit">
      {{ t("common.create") }}
    </ui-button>

    <ui-button v-else-if="status === 'loading'" disabled>
      <ui-progress variant="circular" />
    </ui-button>

    <ui-button v-else-if="status === 'success'" @click="close">
      {{ t("common.close") }}
    </ui-button>

    <workspace-make-form-actions-error
      v-else-if="status === 'error'"
      :retry="handleSubmit"
      :prev="toPrevious"
    />
  </template>
</template>
