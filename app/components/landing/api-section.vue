<template>
  <section class="api-section">
    <ui-container :padding="[80, 15]">
      <div class="section-header">
        <h2 class="section-title">REST API для разработчиков</h2>
        <p class="section-subtitle">Встраивайте Taple в свои продукты без ограничений</p>
      </div>

      <div class="api-grid">
        <div v-for="feature in apiFeatures" :key="feature.title" class="api-feature-card">
          <div class="api-feature-card__icon">
            <Icon :name="`my-icon:${feature.icon}`" class="api-feature-card__svg" />
          </div>
          <h3 class="api-feature-card__title">{{ feature.title }}</h3>
          <p class="api-feature-card__desc">{{ feature.description }}</p>
        </div>
      </div>

      <div class="api-demo">
        <div class="api-demo__copy">
          <h3 class="api-demo__title">Простая интеграция</h3>
          <p class="api-demo__desc">Один запрос — и свежие лиды из базы Taple уже в вашем приложении. Авторизация по Bearer-токену, ответ в JSON.</p>
          <ul class="api-demo__features">
            <li>Полная документация в Swagger</li>
            <li>Примеры на Python, JS, PHP</li>
            <li>Rate limits и квоты по плану</li>
            <li>Webhooks для событий в реальном времени</li>
          </ul>
        </div>
        <div class="api-demo__code">
          <div class="code-block">
            <div class="code-block__header">
              <span class="code-block__label">GET /api/v1/leads</span>
              <button class="code-block__copy" @click="copyCode" :class="{ copied }">
                {{ copied ? 'Скопировано!' : 'Копировать' }}
              </button>
            </div>
            <pre class="code-block__body"><code>{{ codeExample }}</code></pre>
          </div>
        </div>
      </div>

      <div class="api-cta">
        <h3 class="api-cta__title">Готовы начать?</h3>
        <p class="api-cta__desc">Зарегистрируйтесь и получите API-ключ бесплатно</p>
        <NuxtLink to="/contacts" class="api-cta__btn">Получить доступ</NuxtLink>
      </div>
    </ui-container>
  </section>
</template>

<script setup lang="ts">
const copied = ref(false)

const codeExample = `curl -X GET "https://api.taple.ru/v1/leads" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "city": "Москва",
    "industry": "retail",
    "limit": 50
  }'`

function copyCode() {
  navigator.clipboard.writeText(codeExample)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const apiFeatures = [
  {
    icon: 'lock',
    title: 'Безопасная авторизация',
    description: 'Bearer-токены с гибким управлением правами доступа и ротацией ключей',
  },
  {
    icon: 'energy',
    title: 'Высокая производительность',
    description: 'До 10 000 запросов в минуту, ответ менее 200 мс на 95-м перцентиле',
  },
  {
    icon: 'settings',
    title: 'Webhooks',
    description: 'Получайте уведомления в реальном времени о новых лидах и изменениях в базе',
  },
  {
    icon: 'inbox',
    title: 'SDKs и примеры',
    description: 'Готовые библиотеки для Python, Node.js, PHP и подробная документация',
  },
]
</script>

<style scoped>
.api-section {
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

.api-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 60px;
}

.api-feature-card {
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.api-feature-card__icon {
  width: 40px;
  height: 40px;
  background: var(--color-highlight-l);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.api-feature-card__svg {
  width: 18px;
  height: 18px;
}

.api-feature-card__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-neutral-dd);
}

.api-feature-card__desc {
  font-size: 13px;
  color: var(--color-neutral-dm);
  line-height: 1.6;
}

/* ── Demo block ──────────────────────────── */
.api-demo {
  display: flex;
  gap: 60px;
  align-items: flex-start;
  margin-bottom: 60px;
}

.api-demo__copy {
  flex: 1;
}

.api-demo__title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 12px;
}

.api-demo__desc {
  font-size: 16px;
  color: var(--color-neutral-dm);
  line-height: 1.6;
  margin-bottom: 24px;
}

.api-demo__features {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.api-demo__features li {
  font-size: 14px;
  color: var(--color-neutral-dm);
  padding-left: 20px;
  position: relative;
}

.api-demo__features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: 700;
}

.api-demo__code {
  flex: 0 0 500px;
}

/* ── Code block ──────────────────────────── */
.code-block {
  background: #1e2030;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.code-block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #161826;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.code-block__label {
  font-size: 12px;
  color: #7c8db5;
  font-family: monospace;
}

.code-block__copy {
  font-size: 11px;
  color: #7c8db5;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 3px 10px;
  cursor: pointer;
  font-family: var(--font-base);
  transition: color var(--transition-base), border-color var(--transition-base);
}

.code-block__copy:hover,
.code-block__copy.copied {
  color: var(--color-success);
  border-color: var(--color-success);
}

.code-block__body {
  padding: 20px 16px;
  margin: 0;
  overflow-x: auto;
}

.code-block__body code {
  font-family: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  font-size: 13px;
  color: #cdd6f4;
  line-height: 1.7;
  white-space: pre;
}

/* ── CTA banner ──────────────────────────── */
.api-cta {
  background: var(--color-primary);
  border-radius: 20px;
  padding: 48px;
  text-align: center;
  color: var(--color-secondary);
}

.api-cta__title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.api-cta__desc {
  font-size: 18px;
  opacity: 0.85;
  margin-bottom: 28px;
}

.api-cta__btn {
  display: inline-flex;
  align-items: center;
  padding: 14px 36px;
  background: var(--color-secondary);
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 700;
  border-radius: 40px;
  text-decoration: none;
  transition: opacity var(--transition-base);
}

.api-cta__btn:hover {
  opacity: 0.9;
}

@media (max-width: 900px) {
  .api-grid { grid-template-columns: repeat(2, 1fr); }
  .api-demo { flex-direction: column; }
  .api-demo__code { flex: none; width: 100%; }
}

@media (max-width: 560px) {
  .api-grid { grid-template-columns: 1fr; }
}
</style>
