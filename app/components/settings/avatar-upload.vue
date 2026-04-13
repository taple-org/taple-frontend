<template>
  <div class="settings-card">
    <div class="card-header">
      <h2 class="card-title">Фото профиля</h2>
      <p class="card-desc">Ваше фото отображается в профиле и комментариях. JPG, PNG — не более 5 МБ</p>
    </div>

    <div class="avatar-row">
      <div class="avatar" :style="avatarStyle">
        <img v-if="previewUrl" :src="previewUrl" alt="avatar" class="avatar-img" />
        <span v-else class="avatar-initials">{{ initials }}</span>
      </div>

      <div class="avatar-actions">
        <label class="btn-secondary" :class="{ loading: isUploading }">
          <input
              ref="fileInput"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style="display: none"
              @change="handleFile"
          />
          <Icon name="my-icon:inbox" class="btn-icon" />
          {{ isUploading ? 'Загрузка...' : 'Загрузить фото' }}
        </label>

        <ui-button
            v-if="previewUrl"
            variant="error"
            iconLeft="my-icon:trash"
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

<script setup lang="ts">
const MAX_SIZE_MB = 5

const previewUrl = ref<string | null>(null)
const isUploading = ref(false)
const errorMsg = ref('')
const { user } = storeToRefs(useAuthStore())

const initials = computed(() => `${user.value?.first_name} ${user.value?.last_name}` )

const avatarStyle = computed(() => ({
  background: previewUrl.value ? 'transparent' : 'var(--color-highlight-l)',
}))

async function handleFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  errorMsg.value = ''

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    errorMsg.value = `Файл слишком большой. Максимум ${MAX_SIZE_MB} МБ`
    return
  }

  previewUrl.value = URL.createObjectURL(file)
  isUploading.value = true

  try {
    await new Promise(r => setTimeout(r, 800))
  } catch {
    errorMsg.value = 'Не удалось загрузить фото. Попробуйте ещё раз'
    previewUrl.value = null
  } finally {
    isUploading.value = false
  }
}

function removeAvatar() {
  previewUrl.value = null
  errorMsg.value = ''
  // TODO: await $fetch('/api/user/avatar', { method: 'DELETE' })
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
  line-height: 1.5;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--color-neutral-lm);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-size: 24px;
  font-weight: 500;
  color: var(--color-primary);
}

.avatar-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-neutral-lm);
  background: var(--color-white);
  font-size: 14px;
  color: var(--color-neutral-dd);
  cursor: pointer;
  transition: background var(--transition-base), border-color var(--transition-base);
  font-family: var(--font-base);
}

.btn-secondary:hover {
  background: var(--color-neutral-ll);
  border-color: var(--color-neutral-ld);
}

.btn-secondary.loading {
  opacity: 0.6;
  cursor: wait;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
  transition: background var(--transition-base);
  font-family: var(--font-base);
}

.btn-danger {
  color: var(--color-error);
  border-color: var(--color-error-l);
}

.btn-danger:hover {
  background: var(--color-error-l);
}

.btn-icon {
  width: 15px;
  height: 15px;
}

.error-text {
  margin-top: 12px;
  font-size: 13px;
  color: var(--color-error);
}
</style>