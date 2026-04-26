<script setup lang="ts">
import { Steps } from "@ark-ui/vue/steps";
import { useWorkspaceMakeFlow } from "~/composables/workspace/useWorkspaceMakeFlow";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const controller = useWorkspaceMakeFlow();

const props = defineProps<{
  prev: () => void;
  hasPrevious: boolean;
  percent: number;
  current: number;
  steps: number;
  title?: string;
  description?: string;
}>();

const percent = computed(() => Math.round(props.percent));
</script>

<template>
  <header class="header">
    <div class="header__actions">
      <button class="back" @click="props.prev" :disabled="!props.hasPrevious">
        <Icon name="my-icon:arrow-left" height="12" width="12" />
        <span>{{ t("common.back") }}</span>
      </button>
      <Icon
        name="my-icon:close"
        class="close"
        height="12"
        width="12"
        @click="controller.close"
      />
    </div>

    <section class="progress-bar">
      <span class="progress-bar__label"
        >{{ percent }}% {{ t("workspace.completed") }}</span
      >
      <Steps.List class="progress-bar__list">
        <Steps.Item
          v-for="index in props.steps"
          :key="index"
          :index="index - 1"
          class="progress-bar__item"
        >
          <Steps.Indicator class="progress-bar__indicator" />
        </Steps.Item>
      </Steps.List>
      <span class="progress-bar__steps"
        >{{ t("workspace.step") }} {{ props.current }} {{ t("common.of") }}
        {{ props.steps }}</span
      >
    </section>

    <div class="header__title" v-if="title">{{ props.title }}</div>
    <div class="header__description" v-if="props.description">
      {{ props.description }}
    </div>
  </header>
</template>
<style scoped>
.header__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  flex: 1 0 0;
  padding-bottom: 10px;
}

.header__title {
  color: var(--color-neutral-dd);
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: 26px;
}

.header__description {
  color: var(--color-neutral-dl);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.progress {
  padding-top: 6px;
  padding-bottom: 10px;
}

.back {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--color-neutral-dl);
}

.back,
.close {
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.back {
  background: none;
  border: none;
  cursor: pointer;
}

.close {
  color: var(--color-neutral-dl);
}

.progress-bar__label {
  color: var(--color-primary);
  text-align: center;
  font-size: 13px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.progress-bar__list {
  display: flex;
  height: 8px;
  align-items: flex-start;
  gap: 6px;
  align-self: stretch;
  padding-block: 5px;
}

.progress-bar__steps {
  color: var(--color-neutral-dl);
  text-align: center;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.progress-bar__item {
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 4px;
  background: var(--color-neutral-lm);
  overflow: hidden;
}

.progress-bar__indicator {
  display: block;
  width: 0;
  height: 100%;
  border-radius: 4px;

  &[data-complete] {
    width: 100%;
    background-color: var(--color-primary);
  }

  &[data-incomplete] {
    width: 0%;
  }
}
</style>
