<script setup lang="ts">
import { useAuthModalController } from "~/composables/modals/useAuthModalController";

const { open } = useAuthModalController();

const features = [
  {
    icon: "my-icon:energy",
    title: "REST API",
    description: "Простая интеграция через стандартный REST интерфейс. Поддержка JSON, быстрые ответы.",
  },
  {
    icon: "my-icon:lock",
    title: "Аутентификация",
    description: "Безопасный доступ через API-ключи. Управление токенами в личном кабинете.",
  },
  {
    icon: "my-icon:search",
    title: "Поиск контрагентов",
    description: "Мгновенный поиск и обогащение данных по ИНН, названию или реквизитам.",
  },
  {
    icon: "my-icon:settings",
    title: "Мониторинг",
    description: "Отслеживайте изменения в данных контрагентов через вебхуки и API-уведомления.",
  },
];

const codeExample = `curl -X GET "https://api.taple.ru/v1/contractors/search" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "ООО Ромашка",
    "limit": 10,
    "filters": {
      "region": "77",
      "status": "active"
    }
  }'`;
</script>

<template>
  <div class="api-page">

    <!-- Features grid -->
    <section class="api-features">
      <ui-container :padding="[60, 15]">
        <h2 class="api-features__title">Возможности API</h2>
        <p class="api-features__subtitle">
          Интегрируйте поиск контрагентов напрямую в ваши системы и сервисы
        </p>
        <ul class="api-features__grid">
          <li v-for="feature in features" :key="feature.title" class="api-feature-card">
            <div class="api-feature-card__icon-wrap">
              <Icon :name="feature.icon" class="api-feature-card__icon" />
            </div>
            <h3 class="api-feature-card__title">{{ feature.title }}</h3>
            <p class="api-feature-card__description">{{ feature.description }}</p>
          </li>
        </ul>
      </ui-container>
    </section>

    <!-- Code example -->
    <section class="api-example">
      <ui-container :padding="[60, 15]">
        <div class="api-example__inner">

          <div class="api-example__copy">
            <ui-badge variant="primary" size="sm">REST API</ui-badge>
            <h2 class="api-example__title">Простая интеграция</h2>
            <p class="api-example__description">
              Несколько строк кода — и вы получаете доступ к актуальной базе
              контрагентов. Поддерживаем все популярные языки и фреймворки.
            </p>
            <ul class="api-example__points">
              <li class="api-example__point">
                <Icon name="my-icon:check" class="api-example__point-icon" />
                <span>Подробная документация с примерами</span>
              </li>
              <li class="api-example__point">
                <Icon name="my-icon:check" class="api-example__point-icon" />
                <span>SDK для Python, JavaScript, PHP, Go</span>
              </li>
              <li class="api-example__point">
                <Icon name="my-icon:check" class="api-example__point-icon" />
                <span>Sandbox-среда для тестирования</span>
              </li>
            </ul>
            <ui-button class="api-example__cta" @click="open('register')">
              Получить API-ключ
            </ui-button>
          </div>

          <div class="api-example__code-wrap">
            <div class="code-block">
              <div class="code-block__header">
                <div class="code-block__dots">
                  <span class="dot dot--red" />
                  <span class="dot dot--yellow" />
                  <span class="dot dot--green" />
                </div>
                <span class="code-block__lang">bash</span>
              </div>
              <pre class="code-block__body"><code>{{ codeExample }}</code></pre>
            </div>
          </div>

        </div>
      </ui-container>
    </section>

    <!-- CTA banner -->
    <section class="api-cta">
      <ui-container :padding="[80, 15]">
        <div class="api-cta__inner">
          <div class="api-cta__copy">
            <h2 class="api-cta__title">Готовы начать?</h2>
            <p class="api-cta__description">
              Зарегистрируйтесь и получите 100 бесплатных запросов для тестирования.
            </p>
          </div>
          <div class="api-cta__actions">
            <ui-button class="api-cta__btn" @click="open('register')">
              Зарегистрироваться
            </ui-button>
            <ui-button class="api-cta__btn" variant="outline" @click="$router.push('/contacts')">
              Связаться с нами
            </ui-button>
          </div>
        </div>
      </ui-container>
    </section>

  </div>
</template>

<style scoped>
/* ══════════════════════════════════════════
   FEATURES GRID
══════════════════════════════════════════ */
.api-features {
  background-color: var(--color-neutral-ll);
}

.api-features__title {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 8px;
}

.api-features__subtitle {
  font-size: 16px;
  color: var(--color-neutral-dl);
  margin-bottom: 40px;
}

.api-features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.api-feature-card {
  background-color: var(--color-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-neutral-lm);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: box-shadow var(--transition-base);
}

.api-feature-card:hover {
  box-shadow: 0 4px 20px 0 color-mix(in srgb, var(--color-primary) 12%, transparent);
  border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-neutral-lm));
}

.api-feature-card__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: var(--color-highlight-l);
  display: flex;
  align-items: center;
  justify-content: center;
}

.api-feature-card__icon {
  width: 22px;
  height: 22px;
  color: var(--color-primary);
}

.api-feature-card__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

.api-feature-card__description {
  font-size: 14px;
  color: var(--color-neutral-dl);
  line-height: 1.6;
}

/* ══════════════════════════════════════════
   CODE EXAMPLE
══════════════════════════════════════════ */
.api-example {
  background-color: var(--color-secondary);
}

.api-example__inner {
  display: flex;
  align-items: center;
  gap: 60px;
}

/* Left copy */
.api-example__copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.api-example__title {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  line-height: 1.15;
}

.api-example__description {
  font-size: 16px;
  color: var(--color-neutral-dl);
  line-height: 1.65;
}

.api-example__points {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.api-example__point {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: var(--color-neutral-dd);
}

.api-example__point-icon {
  width: 20px;
  height: 20px;
  color: var(--color-success);
  flex-shrink: 0;
}

.api-example__cta {
  align-self: flex-start;
  border-radius: 40px;
}

/* Right code block */
.api-example__code-wrap {
  flex: 0 0 520px;
}

.code-block {
  background-color: #1a1d27;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
}

.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background-color: #13151f;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.code-block__dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot--red    { background-color: #ff5f57; }
.dot--yellow { background-color: #febc2e; }
.dot--green  { background-color: #28c840; }

.code-block__lang {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.code-block__body {
  padding: 24px;
  margin: 0;
  overflow-x: auto;
}

.code-block__body code {
  font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", "Courier New", monospace;
  font-size: 13px;
  line-height: 1.7;
  color: #a9b8d4;
  white-space: pre;
}

/* ══════════════════════════════════════════
   CTA BANNER
══════════════════════════════════════════ */
.api-cta {
  background-color: var(--color-primary);
}

.api-cta__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.api-cta__copy {
  color: var(--color-secondary);
}

.api-cta__title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}

.api-cta__description {
  font-size: 16px;
  color: color-mix(in srgb, var(--color-secondary) 75%, transparent);
}

.api-cta__actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.api-cta__btn {
  border-radius: 40px;
  white-space: nowrap;
}

/* white outline variant for the blue bg */
.api-cta__btn:last-child {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

.api-cta__btn:last-child:hover {
  background-color: var(--color-secondary);
  color: var(--color-primary);
}

/* ══════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════ */
@media (max-width: 1100px) {
  .api-features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .api-example__inner {
    flex-direction: column;
  }

  .api-example__code-wrap {
    flex: unset;
    width: 100%;
  }

  .api-cta__inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .api-features__grid {
    grid-template-columns: 1fr;
  }

  .api-example__title {
    font-size: 26px;
  }

  .api-cta__title {
    font-size: 26px;
  }

  .api-cta__actions {
    flex-direction: column;
    width: 100%;
  }

  .api-cta__btn {
    width: 100%;
  }
}
</style>
