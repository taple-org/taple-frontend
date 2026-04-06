<script lang="ts" setup>
import { Steps } from '@ark-ui/vue';
import { useWorkspaceMakeFlow } from '~/composables/workspace/useWorkspaceMakeFlow';

const { isOpen, current, steps, status } = storeToRefs(useWorkspaceMakeFlow())
const { toNext, handleSubmit, items, close } = useWorkspaceMakeFlow()

</script>

<template>
  <ui-simple-modal v-model:open="isOpen">
    <Steps.RootProvider :value="steps" class="steps">
      <Steps.Context v-slot="{
        hasPrevStep, value: current, count, percent,
        goToPrevStep, goToNextStep
      }">

        <workspace-make-form-header :current :percent :steps="count" :title="items[current]?.[1]?.title!"
          :description="current < count ? items[current]?.[1]?.description : undefined"
          :has-previous="hasPrevStep && current < count" :prev="goToPrevStep" />

        <Steps.Content v-for="([key, modal], index) in items" :key="key" :index="index">
          <component :is="modal.component" />
        </Steps.Content>

        <Steps.CompletedContent>
          <div v-if="status === 'idle'" class="completed">
            <div class="completed__icon-ring">
              <Icon size="36" name="my-icon-inbox" />
            </div>
            <h2 class="completed__title">Всё готово к созданию</h2>
            <p class="completed__description">
              Проверьте введённые данные перед созданием рабочего пространства
            </p>
          </div>

          <div v-else-if="status === 'loading'" class="completed">
            <div class="completed__icon-ring completed__icon-ring--loading">
              <Icon size="36" name="my-icon-loader" />
            </div>
            <h2 class="completed__title">Создание...</h2>
            <p class="completed__description">Пожалуйста, подождите</p>
          </div>

          <!-- Success -->
          <div v-else-if="status === 'success'" class="completed">
            <div class="completed__icon-ring completed__icon-ring--success">
              <Icon size="36" name="my-icon-check" />
            </div>
            <h2 class="completed__title">Рабочее пространство создано!</h2>
            <p class="completed__description">Вы можете начать работу прямо сейчас</p>
          </div>

          <!-- Error -->
          <div v-else-if="status === 'error'" class="completed">
            <div class="completed__icon-ring completed__icon-ring--error">
              <Icon size="36" name="my-icon-x-circle" />
            </div>
            <h2 class="completed__title">Что-то пошло не так</h2>
            <p class="completed__description">
              Попробуйте ещё раз или свяжитесь с поддержкой
            </p>
          </div>
        </Steps.CompletedContent>

        <ui-button v-if="current < count" @click="toNext">
          Далее
        </ui-button>

        <template v-else>
          <ui-button v-if="status === 'idle'" @click="handleSubmit">
            Создать
          </ui-button>

          <ui-button v-else-if="status === 'loading'" disabled>
            Создание...
          </ui-button>

          <div v-else-if="status === 'success'" class="actions">
            <ui-button @click="close">
              Закрыть
            </ui-button>
          </div>

          <div v-else-if="status === 'error'" class="actions">
            <ui-button variant="outline" @click="goToPrevStep">
              Назад
            </ui-button>
            <ui-button @click="handleSubmit">
              Повторить
            </ui-button>
          </div>
        </template>

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

.completed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 12px 8px;
  text-align: center;
}

.completed__icon-ring {
  color: var(--color-neutral-dl);
  display: flex;
  align-items: center;
  justify-content: center;
}

.completed__icon-ring--success {
  color: var(--color-success);
}

.completed__icon-ring--error {
  color: var(--color-danger);
}

.completed__icon-ring--loading {
  color: var(--color-primary);
}

.completed__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin: 0;
}

.completed__description {
  font-size: 13px;
  color: var(--color-neutral-dl);
  line-height: 1.6;
  max-width: 300px;
  margin: 0;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
