<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Личная информация</h2>
      <p class="card-desc">Ваши персональные данные</p>
    </div>

    <form class="form-grid" @submit.prevent="handleSubmit">
      <ui-form-field
          type="text"
          v-model="form.firstName"
          :error="errors.firstName"
          label="Имя"
          placeholder="Введите имя"
      />
      <ui-form-field
          type="text"
          v-model="form.lastName"
          :error="errors.lastName"
          label="Фамилия"
          placeholder="Введите фамилию"
      />


      <ui-form-field
        type="select"
        v-model="form.language"
        :error="errors.language"
        label="Язык"
        placeholder="Выберите язык"
        :options="[
            { label: 'Русский', value: 'ru' },
            { label: 'English', value: 'en' }
        ]"
        />

      <div class="form-footer">
        <ui-button variant="outline">
          Отмена
        </ui-button>
        <ui-button type="submit" variant="primary">
          Сохранить изменения
        </ui-button>
      </div>
    </form>

    <ui-badge v-if="successMessage" variant="primary">
      {{ successMessage }}
    </ui-badge>
  </div>
</template>

<script setup lang="ts">
interface ProfileForm {
  firstName: string
  lastName: string
  language: string

}

const initialForm: ProfileForm = {
  firstName: '',
  lastName: '',
  language: 'ru',
}

const form = reactive<ProfileForm>({ ...initialForm })
const savedForm = ref<ProfileForm>({ ...initialForm })

const errors = reactive<Partial<Record<keyof ProfileForm, string>>>({})
const isLoading = ref(false)
const successMessage = ref('')
const handleSubmit = () => {
  console.log(form)
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

.form-footer {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .field-full {
    grid-column: 1;
  }
}
</style>