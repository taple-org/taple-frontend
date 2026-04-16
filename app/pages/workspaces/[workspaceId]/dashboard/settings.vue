<script setup lang="ts">
import type {
  TenantRead,
  TenantMemberRead,
  TenantUserRole,
} from "~/api/generated/api";

definePageMeta({
  title: "Настройки рабочего пространства",
  layout: "dashboard",
});

const route = useRoute();
const workspaceId = computed(() => route.params.workspaceId as string);
const { $apiClient } = useNuxtApp();

// ── Workspace Profile ───────────────────────────────────────────
const workspace = ref<TenantRead | null>(null);
const workspaceName = ref("");
const isLoadingWorkspace = ref(true);
const isSavingName = ref(false);
const nameSaved = ref(false);

// Fetch workspace data
async function fetchWorkspace() {
  try {
    isLoadingWorkspace.value = true;
    const response = await $apiClient.api.getTenantApiV1TenantsTenantIdGet(
      workspaceId.value,
    );
    workspace.value = response.data.result;
    workspaceName.value = workspace.value?.name ?? "";
  } catch (error) {
    console.error("Failed to fetch workspace:", error);
  } finally {
    isLoadingWorkspace.value = false;
  }
}

onMounted(() => {
  fetchWorkspace();
});

async function saveWorkspaceName() {
  if (!workspaceName.value.trim()) return;
  isSavingName.value = true;
  nameSaved.value = false;
  try {
    await $apiClient.api.updateTenantApiV1TenantsTenantIdPatch(
      workspaceId.value,
      { name: workspaceName.value },
    );
    nameSaved.value = true;
    setTimeout(() => {
      nameSaved.value = false;
    }, 3000);
  } catch (error) {
    console.error("Failed to update workspace name:", error);
  } finally {
    isSavingName.value = false;
  }
}

// ── Members ─────────────────────────────────────────────────────
type MemberRole = "Owner" | "Admin" | "Member";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: MemberRole;
}

const members = ref<Member[]>([]);
const isLoadingMembers = ref(true);

// Map API role to local role type
function mapApiRole(role: TenantUserRole): MemberRole {
  switch (role) {
    case "owner":
      return "Owner";
    case "admin":
      return "Admin";
    case "member":
      return "Member";
    default:
      return "Member";
  }
}

// Fetch members
async function fetchMembers() {
  try {
    isLoadingMembers.value = true;
    const response =
      await $apiClient.api.listMembersApiV1TenantsTenantIdMembersGet(
        workspaceId.value,
      );
    members.value = response.data.result.map((m: TenantMemberRead) => ({
      id: m.id,
      firstName: m.first_name ?? "",
      lastName: m.last_name ?? "",
      email: m.email ?? "",
      role: mapApiRole(m.role_code),
    }));
  } catch (error) {
    console.error("Failed to fetch members:", error);
  } finally {
    isLoadingMembers.value = false;
  }
}

onMounted(() => {
  fetchMembers();
});

const inviteEmail = ref("");
const isInviting = ref(false);

async function inviteMember() {
  if (!inviteEmail.value.trim()) return;
  isInviting.value = true;
  try {
    // TODO: await $apiClient.inviteToTenant({ workspaceId: workspaceId.value, email: inviteEmail.value })
    await new Promise((r) => setTimeout(r, 500));
    inviteEmail.value = "";
  } finally {
    isInviting.value = false;
  }
}

async function removeMember(id: string) {
  members.value = members.value.filter((m) => m.id !== id);
  // TODO: await $apiClient.removeTenantMember(workspaceId.value, id)
}

function initials(m: Member) {
  return ((m.firstName[0] ?? "") + (m.lastName[0] ?? "")).toUpperCase();
}

const roleLabel: Record<MemberRole, string> = {
  Owner: "Владелец",
  Admin: "Администратор",
  Member: "Участник",
};

// ── Lead Tags ───────────────────────────────────────────────────
const tags = ref<string[]>([
  "Горячий лид",
  "В работе",
  "Ожидание",
  "Потенциал",
]);
const newTag = ref("");
const isSavingTags = ref(false);
const tagsSaved = ref(false);

function addTag() {
  const t = newTag.value.trim();
  if (!t || tags.value.includes(t)) return;
  tags.value.push(t);
  newTag.value = "";
}

function removeTag(tag: string) {
  tags.value = tags.value.filter((t) => t !== tag);
}

async function saveTags() {
  isSavingTags.value = true;
  tagsSaved.value = false;
  try {
    // TODO: await $apiClient.updateTenantTags(workspaceId.value, tags.value)
    await new Promise((r) => setTimeout(r, 400));
    tagsSaved.value = true;
    setTimeout(() => {
      tagsSaved.value = false;
    }, 3000);
  } finally {
    isSavingTags.value = false;
  }
}
</script>

<template>
  <ui-container :padding="[20, 15, 20]" class="settings-container">
    <div class="ws-settings">
      <div class="page-header">
        <h1 class="page-title">Настройки пространства</h1>
        <p class="page-desc">
          Управляйте профилем, участниками и настройками рабочего пространства
        </p>
      </div>

      <!-- Workspace Profile -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">Профиль пространства</h2>
          <p class="card-desc">Название отображается в шапке и ссылках</p>
        </div>

        <form class="name-form" @submit.prevent="saveWorkspaceName">
          <ui-form-field
            type="text"
            v-model="workspaceName"
            label="Название"
            placeholder="Название рабочего пространства"
            :disabled="isLoadingWorkspace"
          />
          <div class="form-footer">
            <span v-if="isLoadingWorkspace" class="saved-hint"
              >Загрузка...</span
            >
            <span v-else-if="nameSaved" class="saved-hint">Сохранено</span>
            <ui-button
              type="submit"
              :disabled="isSavingName || isLoadingWorkspace"
            >
              {{ isSavingName ? "Сохранение..." : "Сохранить" }}
            </ui-button>
          </div>
        </form>
      </div>

      <!-- Members -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">Участники</h2>
          <p class="card-desc">Управляйте доступом к рабочему пространству</p>
        </div>

        <div class="invite-row">
          <ui-form-field
            type="email"
            v-model="inviteEmail"
            placeholder="email@company.com"
            label="Email для приглашения"
            class="invite-input"
          />
          <ui-button
            :disabled="isInviting || !inviteEmail"
            @click="inviteMember"
          >
            {{ isInviting ? "Отправка..." : "Пригласить" }}
          </ui-button>
        </div>

        <div class="member-list">
          <div v-if="isLoadingMembers" class="member-loading">
            Загрузка участников...
          </div>
          <div v-else-if="members.length === 0" class="member-empty">
            Нет участников
          </div>
          <div v-for="member in members" :key="member.id" class="member-row">
            <div class="member-avatar">{{ initials(member) }}</div>
            <div class="member-info">
              <div class="member-name">
                {{ member.firstName }} {{ member.lastName }}
              </div>
              <div class="member-email">{{ member.email }}</div>
            </div>
            <span
              class="role-badge"
              :class="`role-badge--${member.role.toLowerCase()}`"
            >
              {{ roleLabel[member.role] }}
            </span>
            <button
              v-if="member.role !== 'Owner'"
              class="btn-remove"
              @click="removeMember(member.id)"
              title="Удалить участника"
            >
              <Icon name="my-icon:close" class="btn-remove__icon" />
            </button>
          </div>
        </div>
      </div>

      <!-- Lead Tags -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">Теги лидов</h2>
          <p class="card-desc">
            Теги для организации лидов в этом пространстве
          </p>
        </div>

        <div class="tags-wrap">
          <div class="tag-chips">
            <span v-for="tag in tags" :key="tag" class="tag-chip">
              {{ tag }}
              <button class="tag-chip__remove" @click="removeTag(tag)">
                <Icon name="my-icon:close" class="tag-chip__icon" />
              </button>
            </span>
          </div>

          <div class="tag-add-row">
            <input
              v-model="newTag"
              class="tag-input"
              placeholder="Добавить тег..."
              @keydown.enter.prevent="addTag"
            />
            <ui-button variant="outline" @click="addTag">Добавить</ui-button>
          </div>
        </div>

        <div class="form-footer form-footer--tags">
          <span v-if="tagsSaved" class="saved-hint">Сохранено</span>
          <ui-button :disabled="isSavingTags" @click="saveTags">
            {{ isSavingTags ? "Сохранение..." : "Сохранить теги" }}
          </ui-button>
        </div>
      </div>
    </div>
  </ui-container>
</template>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
}

.ws-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  margin-bottom: 4px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-neutral-dd);
  margin-bottom: 4px;
}

.page-desc {
  font-size: 14px;
  color: var(--color-neutral-dl);
}

/* ── Card shell ──────────────────────────── */
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

/* ── Name form ───────────────────────────── */
.name-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 440px;
}

/* ── Invite row ──────────────────────────── */
.invite-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 20px;
}

.invite-input {
  flex: 1;
}

/* ── Member list ─────────────────────────── */
.member-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-neutral-ll);
}

.member-row:last-child {
  border-bottom: none;
}

.member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-highlight-l);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dd);
}

.member-email {
  font-size: 12px;
  color: var(--color-neutral-dl);
  margin-top: 1px;
}

.role-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
  white-space: nowrap;
}

.role-badge--owner {
  background: var(--color-highlight-l);
  color: var(--color-primary);
}
.role-badge--admin {
  background: #fff4e5;
  color: #b05c0a;
}
.role-badge--member {
  background: var(--color-neutral-ll);
  color: var(--color-neutral-dm);
}

.btn-remove {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--color-neutral-dl);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background var(--transition-base),
    color var(--transition-base);
}

.btn-remove:hover {
  background: var(--color-error-l);
  color: var(--color-error);
}

.btn-remove__icon {
  width: 14px;
  height: 14px;
}

/* ── Tags ────────────────────────────────── */
.tags-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tag-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-highlight-l);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 100px;
}

.tag-chip__remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  padding: 0;
  opacity: 0.6;
  transition: opacity var(--transition-base);
}

.tag-chip__remove:hover {
  opacity: 1;
}

.tag-chip__icon {
  width: 12px;
  height: 12px;
}

.tag-add-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.tag-input {
  flex: 1;
  max-width: 280px;
  padding: 9px 12px;
  border: 1px solid var(--color-neutral-lm);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-base);
  color: var(--color-neutral-dd);
  background: var(--color-white);
  outline: none;
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base);
}

.tag-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px
    color-mix(in srgb, var(--color-primary) 12%, transparent);
}

/* ── Form footer ─────────────────────────── */
.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.form-footer--tags {
  border-top: 1px solid var(--color-neutral-ll);
  padding-top: 14px;
}

.saved-hint {
  font-size: 13px;
  color: var(--color-success);
  font-weight: 500;
}

.member-loading,
.member-empty {
  font-size: 14px;
  color: var(--color-neutral-dl);
  padding: 20px 0;
  text-align: center;
}
</style>
