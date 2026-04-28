<script setup lang="ts">
import type {
  ChangeMemberRoleRequest,
  TenantRead,
  TenantMemberRead,
  TenantUserRole,
  InviteMemberRequest,
} from "~/api/generated/api";
import { useNotification } from "~/composables/useNotification";
import { useAuthStore } from "~/stores/auth.store";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const { t } = useI18n();

useSeoMeta({
  title: `${t("settings.workspaceSettings")} — Taple`,
  description: t("settings.workspaceSettingsDesc"),
  robots: "noindex, nofollow",
});

const route = useRoute();
const router = useRouter();
const workspaceId = computed(() => route.params.workspaceId as string);
const { $apiClient } = useNuxtApp();
const notification = useNotification();
const authStore = useAuthStore();

// Current user role in this workspace
const myRole = ref<TenantUserRole | null>(null);
const myUserId = computed(() => authStore.user?.id ?? null);

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
    myRole.value = workspace.value?.my_role ?? null;
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
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: MemberRole;
}

type RoleOption = {
  value: TenantUserRole;
  label: string;
};

const members = ref<Member[]>([]);
const isLoadingMembers = ref(true);

// ── Role Permissions ────────────────────────────────────────────
const roleHierarchy: Record<MemberRole, number> = {
  Owner: 3,
  Admin: 2,
  Member: 1,
};

function canManageMember(targetRole: MemberRole): boolean {
  if (!myRole.value) return false;
  const myLocalRole = mapApiRole(myRole.value);
  const myLevel = roleHierarchy[myLocalRole];
  const targetLevel = roleHierarchy[targetRole];

  // Owner can manage everyone
  if (myLocalRole === "Owner") return true;
  // Admin can only manage Members (not other Admins or Owners)
  if (myLocalRole === "Admin") return targetLevel < myLevel;
  // Member can't manage anyone
  return false;
}

function canChangeRole(targetRole: MemberRole, newRole: MemberRole): boolean {
  if (!myRole.value) return false;
  const myLocalRole = mapApiRole(myRole.value);

  // Owner can change any role to Member or Admin (but NOT to Owner)
  if (myLocalRole === "Owner") {
    return newRole !== "Owner";
  }
  // Admin can only change Members to Member or Admin (but NOT to Owner)
  if (myLocalRole === "Admin") {
    return targetRole === "Member" && newRole !== "Owner";
  }
  // Member can't change any roles
  return false;
}

function canInvite(): boolean {
  if (!myRole.value) return false;
  const myLocalRole = mapApiRole(myRole.value);
  // Owner and Admin can invite
  return myLocalRole === "Owner" || myLocalRole === "Admin";
}

function canLeaveWorkspace(): boolean {
  if (!myRole.value) return false;
  const myLocalRole = mapApiRole(myRole.value);
  // Everyone except Owner can leave
  return myLocalRole !== "Owner";
}

function isCurrentUser(memberUserId: string): boolean {
  return memberUserId === myUserId.value;
}

function isOwner(): boolean {
  if (!myRole.value) return false;
  return mapApiRole(myRole.value) === "Owner";
}

function isAdmin(): boolean {
  if (!myRole.value) return false;
  return mapApiRole(myRole.value) === "Admin";
}

function isMember(): boolean {
  if (!myRole.value) return false;
  return mapApiRole(myRole.value) === "Member";
}

function canManageSettings(): boolean {
  return isOwner() || isAdmin();
}

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

function mapLocalRole(role: MemberRole): TenantUserRole {
  switch (role) {
    case "Owner":
      return "owner";
    case "Admin":
      return "admin";
    case "Member":
    default:
      return "member";
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
      userId: m.user_id,
      firstName: m.first_name ?? "",
      lastName: m.last_name ?? "",
      email: m.email ?? "",
      role: mapApiRole(m.role_code),
    }));
  } catch (error) {
    console.error("Failed to fetch members:", error);
    notification.error(t("common.error"), t("settings.loadingError"));
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
  if (!inviteEmail.value.trim() || !canInvite()) return;
  isInviting.value = true;
  try {
    const request: InviteMemberRequest = {
      email: inviteEmail.value.trim(),
      role_code: "member",
    };
    await $apiClient.api.inviteMemberApiV1TenantsTenantIdMembersInvitePost(
      workspaceId.value,
      request,
    );
    notification.success(t("common.success"), t("settings.inviteSuccess"));
    inviteEmail.value = "";
    // Refresh members list
    await fetchMembers();
  } catch (error) {
    console.error("Failed to invite member:", error);
    notification.error(t("common.error"), t("settings.inviteError"));
  } finally {
    isInviting.value = false;
  }
}

async function removeMember(userId: string, role: MemberRole) {
  if (!canManageMember(role)) return;

  // Don't allow removing yourself through this function
  if (isCurrentUser(userId)) {
    notification.error(t("common.error"), t("settings.removeYourselfError"));
    return;
  }

  try {
    await $apiClient.api.removeMemberApiV1TenantsTenantIdMembersUserIdDelete(
      workspaceId.value,
      userId,
    );
    members.value = members.value.filter((m) => m.userId !== userId);
    notification.success(
      t("common.success"),
      t("settings.removeMemberSuccess"),
    );
  } catch (error) {
    console.error("Failed to remove member:", error);
    notification.error(t("common.error"), t("settings.removeMemberError"));
  }
}

async function updateMemberRole(userId: string, newRole: TenantUserRole) {
  const targetMember = members.value.find((member) => member.userId === userId);
  if (!targetMember) return;

  if (!canChangeRole(targetMember.role, mapApiRole(newRole))) return;

  try {
    const payload: ChangeMemberRoleRequest = { role_code: newRole };
    await $apiClient.api.changeMemberRoleApiV1TenantsTenantIdMembersUserIdRolePatch(
      workspaceId.value,
      userId,
      payload,
    );
    notification.success(t("common.success"), t("settings.roleUpdated"));
    await fetchMembers();
  } catch (error) {
    console.error("Failed to update member role:", error);
    notification.error(t("common.error"), t("settings.roleUpdateError"));
    await fetchMembers();
  }
}

async function leaveWorkspace() {
  if (!canLeaveWorkspace()) return;

  try {
    await $apiClient.api.leaveTenantApiV1TenantsTenantIdLeavePost(
      workspaceId.value,
    );
    notification.success(t("common.success"), t("settings.leaveSuccess"));
    // Redirect to workspaces list
    await router.push("/");
  } catch (error) {
    console.error("Failed to leave workspace:", error);
    notification.error(t("common.error"), t("settings.leaveError"));
  }
}

// Get available roles for changing a member's role (Owner not assignable)
function getRoleOptionsForMember(currentRole: MemberRole) {
  const options: RoleOption[] = [];

  // Only Member and Admin can be assigned via dropdown (Owner cannot be assigned)
  for (const role of ["Member", "Admin"] as MemberRole[]) {
    if (canChangeRole(currentRole, role)) {
      options.push({
        value: mapLocalRole(role),
        label: roleLabel[role],
      });
    }
  }

  return options;
}

function initials(m: Member) {
  return (
    ((m.firstName[0] ?? "") + (m.lastName[0] ?? "")).toUpperCase() ||
    (m.email[0] ?? "?").toUpperCase()
  );
}

const roleLabel: Record<MemberRole, string> = {
  Owner: t("settings.owner"),
  Admin: t("settings.admin"),
  Member: t("settings.member"),
};
</script>

<template>
  <ui-container :padding="[20, 15, 20]" class="settings-container">
    <div class="ws-settings">
      <div class="page-header">
        <h1 class="page-title">{{ t("settings.pageTitle") }}</h1>
        <p class="page-desc">{{ t("settings.pageDescription") }}</p>
      </div>

      <!-- Workspace Profile (Owner and Admin only) -->
      <div v-if="canManageSettings()" class="settings-card">
        <div class="card-header">
          <h2 class="card-title">{{ t("settings.profileCardTitle") }}</h2>
          <p class="card-desc">{{ t("settings.profileCardDesc") }}</p>
        </div>

        <form class="name-form" @submit.prevent="saveWorkspaceName">
          <ui-form-field
            type="text"
            v-model="workspaceName"
            :label="t('settings.nameLabel')"
            :placeholder="t('settings.workspaceNamePlaceholder')"
            :disabled="isLoadingWorkspace"
          />
          <div class="form-footer">
            <span v-if="isLoadingWorkspace" class="saved-hint">{{
              t("common.loading")
            }}</span>
            <span v-else-if="nameSaved" class="saved-hint">{{
              t("settings.saved")
            }}</span>
            <ui-button
              type="submit"
              :disabled="isSavingName || isLoadingWorkspace"
            >
              {{ isSavingName ? t("settings.saving") : t("common.save") }}
            </ui-button>
          </div>
        </form>
      </div>

      <!-- Members -->
      <div class="settings-card">
        <div class="card-header">
          <h2 class="card-title">{{ t("settings.membersCardTitle") }}</h2>
          <p class="card-desc">{{ t("settings.membersCardDesc") }}</p>
        </div>

        <div v-if="canInvite()" class="invite-section">
          <div class="invite-row">
            <ui-form-field
              type="email"
              v-model="inviteEmail"
              placeholder="email@company.com"
              :label="t('settings.inviteEmailLabel')"
              class="invite-input"
            />
            <ui-button
              :disabled="isInviting || !inviteEmail"
              @click="inviteMember"
            >
              {{
                isInviting ? t("settings.inviting") : t("settings.inviteButton")
              }}
            </ui-button>
          </div>
        </div>

        <div class="member-list">
          <div v-if="isLoadingMembers" class="member-loading">
            {{ t("settings.loadingMembers") }}
          </div>
          <div v-else-if="members.length === 0" class="member-empty">
            {{ t("settings.noMembers") }}
          </div>
          <div v-for="member in members" :key="member.id" class="member-row">
            <div class="member-avatar">{{ initials(member) }}</div>
            <div class="member-info">
              <div class="member-name">
                {{ member.firstName }} {{ member.lastName }}
                <span v-if="isCurrentUser(member.userId)" class="member-you">{{
                  t("settings.you")
                }}</span>
              </div>
              <div class="member-email">{{ member.email }}</div>
            </div>

            <!-- Role tag (always visible) -->
            <span
              class="role-badge"
              :class="`role-badge--${member.role.toLowerCase()}`"
            >
              {{ roleLabel[member.role] }}
            </span>

            <!-- Role dropdown for Owner/Admin (to change others' roles) -->
            <ui-form-field
              v-if="
                canManageSettings() &&
                !isCurrentUser(member.userId) &&
                getRoleOptionsForMember(member.role).length > 0
              "
              type="select"
              :model-value="mapLocalRole(member.role)"
              :options="
                getRoleOptionsForMember(member.role).map((r) => ({
                  value: r.value,
                  label: r.label,
                }))
              "
              class="role-select"
              @update:model-value="
                (newRole: string) =>
                  updateMemberRole(member.userId, newRole as TenantUserRole)
              "
            />

            <!-- Leave button for current user (if not owner) -->
            <ui-button
              v-if="isCurrentUser(member.userId) && canLeaveWorkspace()"
              variant="outline"
              size="sm"
              class="btn-leave"
              @click="leaveWorkspace"
            >
              {{ t("settings.leaveButton") }}
            </ui-button>

            <!-- Remove button (Owner/Admin only) -->
            <button
              v-if="
                canManageSettings() &&
                canManageMember(member.role) &&
                !isCurrentUser(member.userId)
              "
              class="btn-remove"
              @click="removeMember(member.userId, member.role)"
              :title="t('settings.removeMember')"
            >
              <Icon name="my-icon:close" class="btn-remove__icon" />
            </button>
          </div>
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
.invite-section {
  margin-bottom: 20px;
}

.invite-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
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

.member-you {
  font-size: 11px;
  color: var(--color-primary);
  font-weight: 500;
  margin-left: 4px;
}

.role-select {
  width: 140px;
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

.btn-leave {
  margin-right: 4px;
}

.btn-remove__icon {
  width: 14px;
  height: 14px;
}

/* ── Form footer ─────────────────────────── */
.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
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
