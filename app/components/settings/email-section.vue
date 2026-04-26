<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">{{ t("settings.emailAddress") }}</h2>
      <p class="card-desc">{{ t("settings.emailAddressDesc") }}</p>
    </div>

    <div class="email-list">
      <div v-for="(item, i) in emails" :key="i" class="email-row">
        <div class="email-info">
          <span class="email-text">{{ item.email || "—" }}</span>
          <span v-if="item.isPrimary" class="badge badge-primary">{{
            t("settings.primary")
          }}</span>
          <span
            class="badge"
            :class="item.verified ? 'badge-verified' : 'badge-unverified'"
          >
            {{
              item.verified ? t("settings.verified") : t("settings.notVerified")
            }}
          </span>
        </div>
        <div class="email-actions">
          <button
            v-if="!item.verified"
            class="btn-link"
            @click="resendVerification(item.email)"
          >
            {{ t("settings.sendCode") }}
          </button>
          <button
            v-if="!item.isPrimary"
            class="btn-link"
            @click="makePrimary(i)"
          >
            {{ t("settings.makePrimary") }}
          </button>
          <button
            v-if="!item.isPrimary"
            class="btn-link btn-link-danger"
            @click="removeEmail(i)"
          >
            {{ t("common.delete") }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!showAddForm">
      <ui-button @click="showAddForm = true" variant="outline">
        {{ t("settings.addEmail") }}
      </ui-button>
    </div>

    <form v-else class="add-form" @submit.prevent="addEmail">
      <ui-form-field
        class="add-form__email"
        type="text"
        v-model="newEmail"
        placeholder="new@example.com"
      />
      <div class="add-form-footer">
        <ui-button type="button" variant="ghost" @click="cancelAdd" size="sm">{{
          t("common.cancel")
        }}</ui-button>
        <ui-button type="submit" :disabled="isLoading" size="sm">
          {{ isLoading ? t("settings.adding") : t("common.add") }}
        </ui-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface EmailEntry {
  email: string;
  verified: boolean;
  isPrimary: boolean;
}

// TODO: загрузить из API
const emails = ref<EmailEntry[]>([
  { email: "askar@example.com", verified: true, isPrimary: true },
  { email: "askar.backup@example.com", verified: false, isPrimary: false },
]);

const showAddForm = ref(false);
const newEmail = ref("");
const newEmailError = ref("");
const isLoading = ref(false);

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function addEmail() {
  newEmailError.value = "";

  if (!validateEmail(newEmail.value)) {
    newEmailError.value = "Введите корректный email";
    return;
  }

  if (emails.value.some((e) => e.email === newEmail.value)) {
    newEmailError.value = "Этот email уже добавлен";
    return;
  }

  isLoading.value = true;
  try {
    // TODO: await $fetch('/api/user/emails', { method: 'POST', body: { email: newEmail.value } })
    await new Promise((r) => setTimeout(r, 500));
    emails.value.push({
      email: newEmail.value,
      verified: false,
      isPrimary: false,
    });
    cancelAdd();
  } finally {
    isLoading.value = false;
  }
}

async function resendVerification(email: string) {
  // TODO: await $fetch('/api/user/emails/verify', { method: 'POST', body: { email } })
  alert(`Код подтверждения отправлен на ${email}`);
}

function makePrimary(index: number) {
  emails.value.forEach((e) => {
    e.isPrimary = false;
  });
  emails.value[index]!.isPrimary = true;
  // TODO: await $fetch('/api/user/emails/primary', { method: 'PUT', body: { email: emails.value[index].email } })
}

function removeEmail(index: number) {
  emails.value.splice(index, 1);
  // TODO: await $fetch('/api/user/emails', { method: 'DELETE', body: { email } })
}

function cancelAdd() {
  showAddForm.value = false;
  newEmail.value = "";
  newEmailError.value = "";
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

.email-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 14px;
}

.email-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-neutral-ll);
  flex-wrap: wrap;
  gap: 8px;
}

.email-row:last-child {
  border-bottom: none;
}

.email-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.email-text {
  font-size: 14px;
  color: var(--color-neutral-dd);
}

.badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 20px;
}

.badge-primary {
  background: var(--color-highlight-l);
  color: var(--color-primary);
}

.badge-verified {
  background: var(--color-success-l);
  color: var(--color-success);
}

.badge-unverified {
  background: var(--color-warning-l);
  color: #7a4a0a;
}

.email-actions {
  display: flex;
  gap: 12px;
}

.btn-link {
  font-size: 13px;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-base);
  padding: 0;
  transition: opacity var(--transition-base);
}

.btn-link:hover {
  opacity: 0.75;
}

.btn-link-danger {
  color: var(--color-error);
}

.add-form {
  margin-top: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.add-form__email {
  flex-grow: 1;
}
</style>
