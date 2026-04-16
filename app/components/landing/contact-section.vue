<script setup lang="ts">
import { Field } from '@ark-ui/vue/field'
import {useContactForm} from "~/composables/contacts/useContactForm";

const { r$, state } = useContactForm()

const isSending = ref(false)
const sent = ref(false)

async function handleSubmit() {
  const result = await r$.$validate()
  if (!result.valid) return

  isSending.value = true
  try {
    // TODO: await $fetch('/api/contact', { method: 'POST', body: { name: state.name, email: state.email, message: state.message } })
    await new Promise(r => setTimeout(r, 800))
    sent.value = true
    r$.$reset()
    setTimeout(() => { sent.value = false }, 5000)
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <section class="contact-section">
    <ui-container :padding="[80, 15]">
      <div class="contact-section__inner">
        <div class="contact-section__copy">
          <h2 class="contact-section__heading">Свяжитесь с нами</h2>
          <p class="contact-section__subheading">Расскажите о задаче — мы подберём решение</p>
          <ul class="contact-section__list">
            <li>Демонстрация платформы</li>
            <li>Вопросы по интеграции</li>
            <li>Корпоративные условия</li>
            <li>Техническая поддержка</li>
          </ul>
        </div>

        <div class="contact-section__form-wrap">
          <form class="contact-form" @submit.prevent="handleSubmit">
            <h3 class="contact-form__title">Напишите нам</h3>

            <ui-form-field
              type="text"
              v-model="r$.$value.name"
              :error="r$.name.$errors[0]"
              label="Имя"
              placeholder="Ваше имя"
            />
            <ui-form-field
              type="email"
              v-model="r$.$value.email"
              :error="r$.email.$errors[0]"
              label="Email"
              placeholder="email@company.com"
            />

            <Field.Root
              class="field"
              :invalid="!!r$.message.$errors[0]"
            >
              <Field.Label class="field__label">Сообщение</Field.Label>
              <Field.Textarea
                class="field-textarea"
                v-model="r$.$value.message"
                placeholder="Опишите вашу задачу..."
                rows="4"
              />
              <Field.ErrorText v-if="r$.message.$errors[0]" class="field__error">
                {{ r$.message.$errors[0] }}
              </Field.ErrorText>
            </Field.Root>

            <div v-if="sent" class="success-banner">
              Сообщение отправлено! Мы ответим в течение одного рабочего дня.
            </div>

            <ui-button type="submit" :disabled="isSending" class="contact-form__submit">
              {{ isSending ? 'Отправка...' : 'Отправить сообщение' }}
            </ui-button>
          </form>
        </div>
      </div>
    </ui-container>
  </section>
</template>

<style scoped>
.contact-section {
  background: var(--color-primary);
}

.contact-section__inner {
  display: flex;
  align-items: center;
  gap: 60px;
}

.contact-section__copy {
  flex: 1;
  color: var(--color-secondary);
}

.contact-section__heading {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 16px;
}

.contact-section__subheading {
  font-size: 22px;
  font-weight: 400;
  opacity: 0.85;
  margin-bottom: 32px;
}

.contact-section__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  padding: 0;
}

.contact-section__list li {
  font-size: 16px;
  padding-left: 24px;
  position: relative;
  opacity: 0.9;
}

.contact-section__list li::before {
  content: '→';
  position: absolute;
  left: 0;
  font-weight: 700;
}

.contact-section__form-wrap {
  flex: 0 0 460px;
}

.contact-form {
  background: var(--color-secondary);
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.contact-form__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

/* Field.Root / Field.Textarea styles mirroring TextField.vue */
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-neutral-dm);
}

.field-textarea {
  width: 100%;
  font-family: var(--font-base);
  font-size: 14px;
  padding: 12px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  outline: none;
  resize: vertical;
  min-height: 100px;
  color: var(--color-neutral-dd);
  background: var(--color-secondary);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.field-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.field[data-invalid] .field-textarea {
  border-color: var(--color-error);
}

.field[data-invalid] .field-textarea:focus {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 15%, transparent);
}

.field__error {
  font-size: 12px;
  color: var(--color-error);
}

.success-banner {
  padding: 12px 16px;
  background: var(--color-success-l);
  color: var(--color-success);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
}

.contact-form__submit {
  width: 100%;
  border-radius: 40px;
}

@media (max-width: 900px) {
  .contact-section__inner {
    flex-direction: column;
    gap: 40px;
  }
  .contact-section__form-wrap {
    flex: none;
    width: 100%;
  }
  .contact-section__heading {
    font-size: 36px;
  }
}
</style>
