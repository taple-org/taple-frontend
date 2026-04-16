<template>
  <section class="how-section">
    <ui-container :padding="[80, 15]">
      <div class="section-header">
        <h2 class="section-title">Как это работает</h2>
        <p class="section-subtitle">Четыре шага от настройки до первого клиента</p>
      </div>
      <div class="steps">
        <div v-for="(step, idx) in steps" :key="step.title" class="step">
          <div class="step__number">{{ idx + 1 }}</div>
          <div class="step__connector" v-if="idx < steps.length - 1" />
          <div class="step__body">
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__desc">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </ui-container>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Настройте источники',
    description: 'Выберите регионы, отрасли и типы бизнеса, которые вас интересуют',
  },
  {
    title: 'Система собирает лиды',
    description: 'Taple ежедневно обходит 2ГИС, госреестры и открытые базы, нормализует и дедуплицирует данные',
  },
  {
    title: 'Оцените и отфильтруйте',
    description: 'Используйте скоринг, теги и фильтры для отбора самых приоритетных контрагентов',
  },
  {
    title: 'Экспортируйте в свой инструмент',
    description: 'Выгружайте готовую базу в Excel, подключайте CRM по API или синхронизируйте с 1С',
  },
]
</script>

<style scoped>
.how-section {
  background: var(--color-secondary);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 18px;
  color: var(--color-neutral-dm);
}

.steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  position: relative;
}

.step__number {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.step__connector {
  position: absolute;
  top: 26px;
  left: calc(50% + 26px);
  right: calc(-50% + 26px);
  height: 2px;
  background: var(--color-neutral-lm);
}

.step__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin-bottom: 10px;
}

.step__desc {
  font-size: 14px;
  color: var(--color-neutral-dm);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .steps {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }
  .step__connector { display: none; }
}

@media (max-width: 560px) {
  .steps {
    grid-template-columns: 1fr;
  }
}
</style>
