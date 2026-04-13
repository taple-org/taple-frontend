<script setup lang="ts">
import type {WorkspaceMakeFlowStatus} from "~/composables/workspace/useWorkspaceMakeFlow";

defineProps<{
  status: WorkspaceMakeFlowStatus,
  canNext: boolean,
  toNext: () => void ,
  toPrevious: () => void ,
  close: () => void,
  handleSubmit: () => void,
}>()
</script>
<template>
  <ui-button v-if="canNext" @click="toNext">
    Далее
  </ui-button>

  <template v-else>
    <ui-button v-if="status === 'idle'" @click="handleSubmit">
      Создать
    </ui-button>

    <ui-button v-else-if="status === 'loading'" disabled>
      <ui-progress variant="circular" />
    </ui-button>

    <ui-button v-else-if="status === 'success'" @click="close">
      Закрыть
    </ui-button>

    <workspace-make-form-actions-error v-else-if="status === 'error'" :retry="handleSubmit" :prev="toPrevious"  />
  </template>
</template>
