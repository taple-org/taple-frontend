<script setup lang="ts">
import { Avatar } from '@ark-ui/vue/avatar'
import { FileUpload } from '@ark-ui/vue/file-upload'

const MAX_SIZE_MB = 5
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

const previewUrl = ref<string | null>(null)
const isUploading = ref(false)
const errorMsg = ref('')
const { user } = storeToRefs(useAuthStore())

const initials = computed(() => {
  const first = user.value?.first_name?.[0] ?? ''
  const last = user.value?.last_name?.[0] ?? ''
  return (first + last).toUpperCase() || '?'
})

async function onFileChange(details: { acceptedFiles: File[] }) {
  const file = details.acceptedFiles[0]
  if (!file) return

  errorMsg.value = ''
  previewUrl.value = URL.createObjectURL(file)
  isUploading.value = true

  try {
    // TODO: upload file to API
    await new Promise(r => setTimeout(r, 800))
  } catch {
    errorMsg.value = 'Не удалось загрузить фото. Попробуйте ещё раз'
    previewUrl.value = null
  } finally {
    isUploading.value = false
  }
}

function onFileReject() {
  errorMsg.value = `Файл слишком большой или неподдерживаемый формат. Максимум ${MAX_SIZE_MB} МБ`
}

function removeAvatar() {
  previewUrl.value = null
  errorMsg.value = ''
  // TODO: await $fetch('/api/user/avatar', { method: 'DELETE' })
}
</script>

<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Фото профиля</h2>
      <p class="card-desc">Ваше фото отображается в профиле и комментариях. JPG, PNG — не более 5 МБ</p>
    </div>

    <div class="avatar-row">
      <!-- Avatar display: Ark UI Avatar handles image/fallback state automatically -->
      <Avatar.Root class="avatar">
        <Avatar.Image
          v-if="previewUrl"
          :src="previewUrl"
          alt="Фото профиля"
          class="avatar__image"
        />
        <Avatar.Fallback class="avatar__fallback">
          {{ initials }}
        </Avatar.Fallback>
      </Avatar.Root>

      <div class="avatar-actions">
        <!-- FileUpload: Ark UI handles input, accept, size validation -->
        <FileUpload.Root
          :max-files="1"
          accept="image/jpeg, image/png, image/webp"
          :max-file-size="MAX_SIZE_BYTES"
          @file-change="onFileChange"
          @file-reject="onFileReject"
        >
          <FileUpload.Trigger
            class="btn-upload"
            :class="{ 'btn-upload--loading': isUploading }"
            :disabled="isUploading"
          >
            <Icon name="my-icon:inbox" class="btn-icon" />
            {{ isUploading ? 'Загрузка...' : 'Загрузить фото' }}
          </FileUpload.Trigger>
          <FileUpload.HiddenInput />
        </FileUpload.Root>

        <ui-button
          v-if="previewUrl"
          variant="error"
          :disabled="isUploading"
          @click="removeAvatar"
        >
          Удалить
        </ui-button>
      </div>
    </div>

    <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
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
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-neutral-dl);
  line-height: 1.5;
}

/* ── Avatar (Ark UI Avatar.Root) ─────────────── */
.avatar-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-neutral-lm);
  background: var(--color-highlight-l);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Ark UI hides the image while loading via data-state='hidden' */
}

.avatar__image[data-state='hidden'] {
  display: none;
}

.avatar__fallback {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-primary);
  /* Ark UI hides the fallback once image loads via data-state='hidden' */
}

.avatar__fallback[data-state='hidden'] {
  display: none;
}

/* ── Upload button (FileUpload.Trigger) ──────── */
.avatar-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-neutral-lm);
  background: var(--color-white);
  font-size: 14px;
  font-family: var(--font-base);
  font-weight: 400;
  color: var(--color-neutral-dd);
  cursor: pointer;
  transition: background var(--transition-base), border-color var(--transition-base);
}

.btn-upload:hover:not(:disabled) {
  background: var(--color-neutral-ll);
  border-color: var(--color-neutral-ld);
}

.btn-upload--loading,
.btn-upload:disabled {
  opacity: 0.6;
  cursor: wait;
}

/* FileUpload.Trigger exposes data-disabled */
.btn-upload[data-disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 15px;
  height: 15px;
}

/* ── Error text ──────────────────────────────── */
.error-text {
  margin-top: 12px;
  font-size: 13px;
  color: var(--color-error);
}
</style>
