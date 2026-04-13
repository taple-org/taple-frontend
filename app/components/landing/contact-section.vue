<script setup lang="ts">
import { Field } from "@ark-ui/vue/field";
import { useContactForm } from "~/composables/contacts/useContactForm";

const { r$ } = useContactForm();

const isSubmitting = ref(false);
const submitStatus = ref<"idle" | "success" | "error">("idle");

const handleSubmit = async () => {
  const result = await r$.$validate();
  if (!result.valid) return;

  isSubmitting.value = true;
  try {
    // TODO: wire up real API call when endpoint is available
    await new Promise((resolve) => setTimeout(resolve, 800));
    submitStatus.value = "success";
    r$.$reset();
  } catch {
    submitStatus.value = "error";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="contact-section">
    <ui-container :padding="[80, 15]">
      <div class="contact-section__inner">

        <!-- Left: copy -->
        <div class="contact-section__copy">
          <h2 class="contact-section__heading">Остались вопросы?</h2>
          <h3 class="contact-section__subheading">Заполните форму</h3>
          <p class="contact-section__description">
            Наша команда свяжется с вами в ближайшее время и ответит на все
            интересующие вопросы.
          </p>
        </div>

        <!-- Right: form card -->
        <div class="contact-section__form-wrap">
          <form class="contact-form" @submit.prevent="handleSubmit" novalidate>

            <ui-form-field
              v-model="r$.$value.name"
              type="text"
              label="Имя"
              placeholder="Введите ваше имя"
              required
              :error="r$.name.$errors[0]"
            />

            <ui-form-field
              v-model="r$.$value.email"
              type="email"
              label="Email"
              placeholder="Введите email"
              required
              :error="r$.email.$errors[0]"
            />

            <!-- Textarea: Field.Root drives data-invalid on Field.Textarea automatically -->
            <Field.Root
              class="field"
              :required="true"
              :invalid="!!r$.message.$errors[0]"
            >
              <Field.Label class="field__label">
                Сообщение
                <span class="field__required" aria-hidden="true">*</span>
              </Field.Label>
              <Field.Textarea
                class="field-textarea"
                v-model="r$.$value.message"
                placeholder="Введите ваше сообщение"
                rows="5"
              />
              <Field.ErrorText v-if="r$.message.$errors[0]" class="field__error">
                {{ r$.message.$errors[0] }}
              </Field.ErrorText>
            </Field.Root>

            <div v-if="submitStatus === 'success'" class="contact-form__success">
              Сообщение отправлено! Мы скоро свяжемся с вами.
            </div>

            <div v-if="submitStatus === 'error'" class="contact-form__error">
              Произошла ошибка. Попробуйте ещё раз.
            </div>

            <ui-button
              type="submit"
              :disabled="isSubmitting"
              class="contact-form__submit"
            >
              {{ isSubmitting ? "Отправка..." : "Отправить" }}
            </ui-button>

          </form>
        </div>

      </div>
    </ui-container>
  </section>
</template>

<style scoped>
/* ── Section shell ──────────────────────────────────── */
.contact-section {
  background-color: var(--color-primary);
}

/* ── Two-column inner ───────────────────────────────── */
.contact-section__inner {
  display: flex;
  align-items: center;
  gap: 60px;
}

/* ── Left copy ──────────────────────────────────────── */
.contact-section__copy {
  flex: 1;
  color: var(--color-secondary);
}

.contact-section__heading {
  font-family: var(--font-base), sans-serif;
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 8px;
}

.contact-section__subheading {
  font-family: var(--font-base), sans-serif;
  font-size: 36px;
  font-weight: 500;
  margin-bottom: 24px;
}

.contact-section__description {
  font-family: var(--font-base), sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: color-mix(in srgb, var(--color-secondary) 75%, transparent);
}

/* ── Right form wrap ────────────────────────────────── */
.contact-section__form-wrap {
  flex: 0 0 480px;
}

/* ── Form card ──────────────────────────────────────── */
.contact-form {
  background-color: var(--color-secondary);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Textarea (mirrors TextField.vue .field-input) ──── */
.field-textarea {
  font-family: var(--font-base), sans-serif;
  font-size: 14px;
  padding: 16px;
  width: 100%;
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  outline: none;
  background-color: var(--color-neutral-ll);
  color: var(--color-neutral-dd);
  resize: vertical;
  min-height: 120px;
  box-sizing: border-box;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.field-textarea::placeholder {
  color: var(--color-neutral-dl);
}

.field-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

/* Ark UI sets data-invalid on Field.Textarea when Field.Root :invalid is true */
.field-textarea[data-invalid] {
  border-color: var(--color-error);
}

.field-textarea[data-invalid]:focus {
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 15%, transparent);
}

/* ── Inline field wrappers (mirrors FormField.vue) ──── */
.field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field__label {
  font-family: var(--font-base);
  font-size: 12px;
  font-weight: 600;
  color: var(--color-neutral-dd);
}

.field__required {
  color: var(--color-error);
  margin-left: 2px;
}

.field__error {
  font-size: 11px;
  color: var(--color-error);
}

/* ── Status banners ─────────────────────────────────── */
.contact-form__success {
  font-size: 14px;
  color: var(--color-success);
  background-color: var(--color-success-l);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  text-align: center;
}

.contact-form__error {
  font-size: 14px;
  color: var(--color-error);
  background-color: var(--color-error-l);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  text-align: center;
}

/* ── Submit button ──────────────────────────────────── */
.contact-form__submit {
  border-radius: 40px;
  width: 100%;
}

/* ── Responsive ─────────────────────────────────────── */
@media (max-width: 900px) {
  .contact-section__inner {
    flex-direction: column;
    align-items: stretch;
    gap: 40px;
  }

  .contact-section__form-wrap {
    flex: unset;
  }

  .contact-section__heading {
    font-size: 32px;
  }

  .contact-section__subheading {
    font-size: 24px;
  }
}
</style>
