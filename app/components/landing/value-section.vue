<template>
  <section class="value-section">
    <ui-container :padding="[80, 15]">
      <div class="section-header">
        <h2 class="section-title">Почему Taple</h2>
        <p class="section-subtitle">Всё, что нужно для системного поиска новых клиентов</p>
      </div>
      <div class="value-grid">
        <div v-for="card in cards" :key="card.title" class="value-card">
          <div class="value-card__icon">
            <Icon :name="`my-icon:${card.icon}`" class="value-card__svg" />
          </div>
          <h3 class="value-card__title">{{ card.title }}</h3>
          <p class="value-card__desc">{{ card.description }}</p>
        </div>
      </div>
    </ui-container>
  </section>
</template>

<script setup lang="ts">
const cards = [
  {
    icon: 'inbox',
    title: 'Свежие данные',
    description: 'База обновляется ежедневно — вы получаете актуальные контрагенты раньше конкурентов',
  },
  {
    icon: 'filter',
    title: 'Умная фильтрация',
    description: 'Отбирайте лиды по отрасли, городу, размеру компании и любым другим параметрам',
  },
  {
    icon: 'check',
    title: 'Без дублей',
    description: 'Нормализация и дедупликация на входе — каждый лид учитывается ровно один раз',
  },
  {
    icon: 'send',
    title: 'Готово к экспорту',
    description: 'Выгружайте в Excel, CRM или 1С одним кликом — без лишних шагов и ручной работы',
  },
]
</script>

<style scoped>
.value-section {
  background: var(--color-secondary);
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

.value-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.value-card {
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: box-shadow var(--transition-base), border-color var(--transition-base);
}

.value-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.value-card__icon {
  width: 48px;
  height: 48px;
  background: var(--color-highlight-l);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.value-card__svg {
  width: 22px;
  height: 22px;
}

.value-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-neutral-dd);
}

.value-card__desc {
  font-size: 14px;
  color: var(--color-neutral-dm);
  line-height: 1.6;
}

@media (max-width: 900px) {
  .value-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 560px) {
  .value-grid { grid-template-columns: 1fr; }
}
</style>
