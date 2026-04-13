<script setup lang="ts">
import type { Lead } from "./types";

defineProps<{
  lead: Lead | null;
}>();

</script>

<template>
  <article v-if="lead" class="leads-info" aria-label="Детали лида">
    <header class="leads-info__head">
      <h3 class="leads-info__title">{{ lead.title }}</h3>
      <p class="leads-info__subtitle">{{ lead.subtitle }}</p>
    </header>

    <section v-if="lead.contacts?.length || lead.email"  class="leads-info__section">
      <h4 class="leads-info__label">Контакты</h4>

      <ul class="leads-info__contacts">
        <li v-for="contact in lead.contacts" :key="contact">
          <Icon name="other-icon-phone" mode="svg" :size="14" />
          <span>{{ contact }}</span>
        </li>
        <li>
          <Icon
            name="my-icon-inbox"
            mode="svg"
            :size="14"
            class="leads-info__mail-icon"
          />
          <span>{{ lead.email }}</span>
        </li>
      </ul>
    </section>

    <section v-if="lead.address" class="leads-info__section">
      <div class="leads-info__row">
        <h4 class="leads-info__label">Локация</h4>
        <a class="leads-info__map-link" href="#" @click.prevent
          >Открыть в 2GIS</a
        >
      </div>
      <p class="leads-info__text">{{ lead.address }}</p>
    </section>

    <section class="leads-info__section">
      <h4 class="leads-info__label">Подходит для</h4>
      <ul class="leads-info__list">
        <li v-for="item in lead.fitScores" :key="item.label">
          {{ item.label }}: {{ item.level }}
        </li>
      </ul>
    </section>

    <section v-if="lead.reasons?.length" class="leads-info__section">
      <h4 class="leads-info__label">Почему высокий лид</h4>
      <ul class="leads-info__list leads-info__list--bulleted">
        <li v-for="reason in lead.reasons" :key="reason">
          {{ reason }}
        </li>
      </ul>
    </section>

    <section class="leads-info__section">
      <h4 class="leads-info__label">Свежесть</h4>
      <p class="leads-info__freshness">{{ lead.freshness }}</p>
    </section>

    <section class="leads-info__section" v-if="lead.branches && lead.branches.length > 0">
      <h4 class="leads-info__label">Филиалы ({{ lead.branches.length }})</h4>
      <ul class="leads-info__branches-list">
        <li v-for="branch in lead.branches" :key="branch.id" class="leads-info__branch-item">
          <div class="leads-info__branch-header">
            <span class="leads-info__branch-name">{{ branch.name || 'Без названия' }}</span>
            <span
              :class="['leads-info__branch-status', branch.isActive ? 'leads-info__branch-status--active' : 'leads-info__branch-status--inactive']"
            >
              {{ branch.isActive ? 'Активен' : 'Неактивен' }}
            </span>
          </div>
          <p class="leads-info__branch-address" v-if="branch.fullAddress">{{ branch.fullAddress }}</p>
          <div v-if="branch.rating != null || branch.reviewCount != null" class="leads-info__branch-signals">
            <span v-if="branch.rating != null" class="leads-info__branch-signal">⭐ {{ branch.rating }}</span>
            <span v-if="branch.reviewCount != null" class="leads-info__branch-signal">💬 {{ branch.reviewCount }}</span>
          </div>
        </li>
      </ul>
    </section>
  </article>

  <article v-else class="leads-info leads-info--empty" aria-label="Детали лида">
    Выберите лид для просмотра подробной информации.
  </article>
</template>

<style scoped>
.leads-info {
  overflow-y:auto;
  height:100%;
  max-height:100%;
  min-width: 30%;
  padding: 8px 16px;
  border-radius: 16px;
  background: var(--color-neutral-ll);
  display: flex;
  box-sizing: border-box;

  flex-direction: column;
}

.leads-info--empty {
  justify-content: center;
  align-items: center;
  color: var(--color-neutral-dl);
  font-size: 14px;
  font-weight: 500;
}

.leads-info__head {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 10px;
}

.leads-info__title {
  margin: 0;
  color: var(--color-neutral-dd);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
}

.leads-info__subtitle {
  margin: 0;
  color: #71727a;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.25;
  letter-spacing: 0.1px;
}

.leads-info__section {
  padding: 5px 0;
  border-top: 1px solid var(--color-neutral-ld);
}

.leads-info__section:first-of-type {
  border-top: 0;
  padding-top: 0;
}

.leads-info__label {
  margin: 0;
  color: var(--color-neutral-dm);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0.4px;
}

.leads-info__contacts,
.leads-info__list {
  list-style: none;
  padding: 0;
  margin: 3px 0 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.leads-info__contacts li,
.leads-info__list li {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--color-neutral-dm);
  font-size: 10px;
  font-weight: 500;
  line-height: 1.25;
  white-space: nowrap;
}

.leads-info__mail-icon {
  color: var(--color-neutral-dm);
}

.leads-info__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.leads-info__map-link {
  color: var(--color-neutral-dl);
  font-size: 9px;
  font-weight: 500;
  line-height: 1.2;
  text-decoration: underline;
  text-decoration-thickness: 0.5px;
  text-underline-offset: 2px;
}

.leads-info__text {
  margin: 3px 0 0;
  color: #71727a;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.25;
  white-space: nowrap;
}

.leads-info__list {
  color: #71727a;
}

.leads-info__list--bulleted {
  list-style: disc;
  padding-left: 14px;
}

.leads-info__list--bulleted li {
  display: list-item;
  white-space: nowrap;
}

.leads-info__freshness {
  margin: 3px 0 0;
  color: var(--color-neutral-dl);
  font-size: 10px;
  font-weight: 500;
  line-height: 1.25;
}

.leads-info__branches-list {
  list-style: none;
  padding: 0;
  margin: 3px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.leads-info__branch-item {
  padding: 6px 8px;
  background: var(--color-neutral-ld);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.leads-info__branch-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.leads-info__branch-name {
  color: var(--color-neutral-dm);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.leads-info__branch-status {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 500;
  white-space: nowrap;
}

.leads-info__branch-status--active {
  background: rgba(76, 175, 80, 0.15);
  color: #4caf50;
}

.leads-info__branch-status--inactive {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.leads-info__branch-address {
  margin: 0;
  color: #71727a;
  font-size: 9px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.leads-info__branch-signals {
  display: flex;
  gap: 6px;
  align-items: center;
}

.leads-info__branch-signal {
  color: var(--color-neutral-dm);
  font-size: 9px;
  font-weight: 500;
}

@media (max-width: 1280px) {
  .leads-info {
    max-width: 100%;
    min-height: auto;
  }

  .leads-info__contacts li,
  .leads-info__list li,
  .leads-info__list--bulleted li,
  .leads-info__text {
    white-space: normal;
  }

  .leads-info__branch-item {
    padding: 8px 10px;
  }

  .leads-info__branch-address {
    white-space: normal;
  }
}
</style>
