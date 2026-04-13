<script lang="ts" setup>
import { WorkspaceMakeFormCompletedError, WorkspaceMakeFormCompletedLoading, WorkspaceMakeFormCompletedSuccess, WorkspaceMakeFormCompletedIdle } from '#components';
import { Steps } from '@ark-ui/vue';
import { useWorkspaceMakeFlow } from '~/composables/workspace/useWorkspaceMakeFlow';

const { isOpen, current, steps, status } = storeToRefs(useWorkspaceMakeFlow())
const { toNext, handleSubmit, items, close } = useWorkspaceMakeFlow()

const configs: Record<'idle' | 'success' | 'loading' | 'error', Component> = {
  'idle': WorkspaceMakeFormCompletedIdle,
  'success': WorkspaceMakeFormCompletedSuccess,
  'loading': WorkspaceMakeFormCompletedLoading,
  'error': WorkspaceMakeFormCompletedError
}

</script>

<template>
  <ui-simple-modal v-model:open="isOpen">
    <Steps.RootProvider :value="steps" class="steps">
      <Steps.Context v-slot="{
        hasPrevStep, value: current, count, percent,
        goToPrevStep
      }">

        <workspace-make-form-header :current :percent :steps="count" :title="items[current]?.[1]?.title!"
          :description="current < count ? items[current]?.[1]?.description : undefined"
          :has-previous="hasPrevStep && status === 'idle'" :prev="goToPrevStep" />

        <Steps.Content v-for="([key, modal], index) in items" :key="key" :index="index">
          <component :is="modal.component" />
        </Steps.Content>

        <Steps.CompletedContent>
          <component :is="configs[status]" v-if="configs[status]" />
        </Steps.CompletedContent>

        <workspace-make-form-actions :canNext="current < count" :status :handleSubmit :toNext :toPrevious="goToPrevStep" :close />

      </Steps.Context>
    </Steps.RootProvider>
  </ui-simple-modal>
</template>

<style scoped>
.steps {
  width: 728px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px;
}

</style>
