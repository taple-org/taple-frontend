<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Личная информация</h2>
      <p class="card-desc">Ваши персональные данные</p>
    </div>

    <form class="form-grid" @submit.prevent="handleSubmit">
      <ui-form-field
        type="text"
        v-model="r$.$value.first_name"
        :error="r$.first_name.$errors[0]"
        label="Имя"
        placeholder="Введите имя"
      />
      <ui-form-field
        type="text"
        v-model="r$.$value.last_name"
        :error="r$.last_name.$errors[0]"
        label="Фамилия"
        placeholder="Введите фамилию"
      />

      <ui-form-field
        class="form__lang"
        type="select"
        v-model="r$.$value.language"
        label="Язык"
        placeholder="Выберите язык"
        :options="[
          { label: 'Русский', value: 'ru' },
          { label: 'English', value: 'en' }
        ]"
      />

      <div class="form-footer">
        <ui-button variant="outline" type="button" @click="r$.$reset()">
          Отмена
        </ui-button>
        <ui-button type="submit" variant="primary" :disabled="isLoading">
          {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
        </ui-button>
      </div>
    </form>

    <div v-if="successMessage" class="success-banner">{{ successMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { useProfileForm } from "~/composables/settings/useProfileForm";
import { useAuthStore } from "~/stores/auth.store";

const authStore = useAuthStore();
const { r$, state } = useProfileForm(computed(() => authStore.user));

const isLoading = ref(false)
const successMessage = ref('')

async function handleSubmit() {
  const result = await r$.$validate()
  if (!result.valid) return

  isLoading.value = true
  successMessage.value = ''
  try {
    Object.assign(authStore.user ?? {}, {
      first_name: state.first_name,
      last_name: state.last_name,
    })
    await new Promise(r => setTimeout(r, 600))
    successMessage.value = 'Профиль обновлён'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.settings-card {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  padding: 20px 24px;
}

.card-header {
  margin-bottom: 20px;
}

.card-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form__lang {
  grid-column: 1 / -1;
}

.form-footer {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.success-banner {
  margin-top: 14px;
  padding: 10px 14px;
  background: var(--color-success-l);
  color: var(--color-success);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form__lang {
    grid-column: 1;
  }
}
</style>
