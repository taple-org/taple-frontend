<script setup lang="ts">
import {email, minLength, required, regex, sameAs} from "@regle/rules";
import { password } from "~/rules/password";

const state = reactive({
  current: '',
  new: '',
  confirm: '',
  isLoading: false,
})
const message = ref<string | null>(null)


const { r$: form } = useRegle(
    state,
    {
      current: {
        ...password
      },
      password: {
        ...password
      },
      confirm: {
        ...password,
        sameAs: withMessage(sameAs(() => state.confirm), 'Не совпадения паролей')
      },
    },
    { id: "change-password" },
)


async function handleSubmit() {
  const valid = await form.$validate();
  try {
    state.isLoading = true;
    await new Promise(r => setTimeout(r, 3000))
  } catch {
  } finally {
    state.isLoading = false;
  }
}
</script>

<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Смена пароля</h2>
      <p class="card-desc">Используйте надёжный пароль длиной от 8 символов</p>
    </div>

    <form class="form" @submit.prevent="handleSubmit">
      <ui-form-field
          label="Текущий пароль"
          placeholder="Введите текущий пароль"
          type="password"
          v-model="form.$value.current"
          :error="form.$errors.current[0]"

      />
      <ui-form-field
          label="Новый пароль"
          placeholder="Введите новый пароль"
          type="password"
          v-model="form.$value.new"
          :error="form.$errors.new[0]"
      />
      <ui-form-field
          label="Подтверждение пароля"
          placeholder="Повторите пароль"
          type="password"
          v-model="form.$value.confirm"
          :error="form.$errors.confirm[0]"
      />
      <div v-if="message" class="success-banner">{{ message }}</div>

      <div class="form-footer">
        <ui-button type="submit" :disabled="state.isLoading">
          {{ state.isLoading ? 'Сохранение...' : 'Сменить пароль' }}
        </ui-button>
      </div>
    </form>
  </div>
</template>
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
  margin-bottom: 10px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-neutral-dl);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.success-banner {
  padding: 10px 14px;
  background: var(--color-success-l);
  color: var(--color-success);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
}
</style>