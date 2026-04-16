<template>
  <section class="features-section">
    <ui-container :padding="[80, 15]">
      <div class="section-header">
        <h2 class="section-title">Возможности платформы</h2>
        <p class="section-subtitle">Полный набор инструментов для B2B-проспектинга</p>
      </div>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-card__icon">
            <Icon :name="`my-icon:${feature.icon}`" class="feature-card__svg" />
          </div>
          <div class="feature-card__body">
            <h3 class="feature-card__title">{{ feature.title }}</h3>
            <p class="feature-card__desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </ui-container>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    icon: 'search',
    title: 'Автопоиск из открытых источников',
    description: '2ГИС, госреестры ЕГРЮЛ/ЕГРИП, открытые базы данных — сбор автоматический без ручного труда',
  },
  {
    icon: 'energy',
    title: 'Скоринг и приоритизация',
    description: 'Алгоритм оценивает каждого лида по релевантности и выводит самых перспективных наверх',
  },
  {
    icon: 'categories',
    title: 'Теги и воронки продаж',
    description: 'Организуйте лиды по статусам, назначайте теги и ведите контрагентов через воронку',
  },
  {
    icon: 'profile',
    title: 'Командный доступ с ролями',
    description: 'Добавляйте участников, настраивайте права и работайте с базой лидов совместно',
  },
  {
    icon: 'settings',
    title: 'API-интеграция',
    description: 'Подключайте Taple к своей CRM или ERP через REST API с документацией и примерами',
  },
  {
    icon: 'inbox',
    title: 'История изменений',
    description: 'Полный лог всех действий с лидами — кто, когда и что изменил, без потери данных',
  },
]
</script>

<style scoped>
.features-section {
  background: var(--color-neutral-ll);
}

.section-header {
  text-align: center;
  margin-bottom: 52px;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature-card {
  background: var(--color-secondary);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.feature-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.feature-card__icon {
  width: 40px;
  height: 40px;
  background: var(--color-highlight-l);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  flex-shrink: 0;
}

.feature-card__svg {
  width: 18px;
  height: 18px;
}

.feature-card__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-neutral-dd);
  margin-bottom: 6px;
}

.feature-card__desc {
  font-size: 13px;
  color: var(--color-neutral-dm);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .features-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .features-grid { grid-template-columns: 1fr; }
}
</style>
