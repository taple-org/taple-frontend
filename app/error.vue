<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

const statusCode = computed(() => Number(props.error.statusCode || 500));

const title = computed(() => {
  if (statusCode.value === 404) return "Страница не найдена";
  if (statusCode.value === 401 || statusCode.value === 403) {
    return "Недостаточно прав доступа";
  }
  return "Упс, что-то пошло не так";
});

const description = computed(() => {
  if (statusCode.value === 404) {
    return "Похоже, такой страницы не существует или ссылка устарела.";
  }
  if (statusCode.value === 401 || statusCode.value === 403) {
    return "Проверьте права доступа или авторизуйтесь в системе.";
  }
  return "Мы уже зафиксировали проблему. Попробуйте обновить страницу или вернуться на главную.";
});

const details = computed(() => {
  return props.error.statusMessage || props.error.message || "Внутренняя ошибка сервера";
});

const hasBackHistory = computed(() => {
  if (!import.meta.client) return false;
  return window.history.length > 1;
});

function goHome() {
  clearError({ redirect: "/" });
}

function goBack() {
  if (hasBackHistory.value) {
    window.history.back();
    return;
  }
  clearError({ redirect: "/" });
}
</script>

<template>
  <main class="error-page">
    <section class="error-page__card">
      <span class="error-page__code">Ошибка {{ statusCode }}</span>
      <h1 class="error-page__title">{{ title }}</h1>
      <p class="error-page__description">{{ description }}</p>
      <p class="error-page__details">{{ details }}</p>

      <div class="error-page__actions">
        <ui-button variant="primary" @click="goHome">
          На главную
        </ui-button>
        <ui-button variant="outline" @click="goBack">
          Назад
        </ui-button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  padding: 24px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 15% 20%, rgba(108, 156, 255, 0.18), transparent 38%),
    radial-gradient(circle at 90% 10%, rgba(58, 192, 160, 0.16), transparent 34%),
    #f7f9ff;
}

.error-page__card {
  width: min(620px, 100%);
  border-radius: 20px;
  border: 1px solid #e6ebf5;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 20px 50px rgba(48, 70, 114, 0.1);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.error-page__code {
  display: inline-flex;
  width: fit-content;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: #eef4ff;
  color: #4f75c2;
}

.error-page__title {
  margin: 4px 0 0;
  font-size: 32px;
  line-height: 1.1;
  font-weight: 600;
  color: #2f3036;
}

.error-page__description {
  margin: 0;
  color: #4f5057;
  font-size: 15px;
  line-height: 1.6;
}

.error-page__details {
  margin: 2px 0 0;
  color: #8f9098;
  font-size: 13px;
  line-height: 1.5;
}

.error-page__actions {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.error-page__actions button {
  flex-grow: 1;
}
@media (max-width: 640px) {
  .error-page {
    padding: 14px;
  }

  .error-page__card {
    padding: 20px;
    border-radius: 16px;
  }

  .error-page__title {
    font-size: 26px;
  }
}
</style>
