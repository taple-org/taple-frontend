<script setup lang="ts">
import { TenantLeadStage } from "~/api/generated/api";
import type {
  TenantLeadListItem,
  CreateTaskRequest,
} from "~/api/generated/api";
import type { LeadFilters } from "~/stores/leads.store";

import DashboardLeadsLeadFiltersBar from "~/components/dashboard/leads/lead-filters-bar.vue";
import DashboardLeadsLeadsTable from "~/components/dashboard/leads/leads-table.vue";
import DashboardLeadsLeadDetailPanel from "~/components/dashboard/leads/lead-detail-panel.vue";
import DashboardLeadsLeadActionsDropdown from "~/components/dashboard/leads/lead-actions-dropdown.vue";
import DashboardLeadsBulkActionsBar from "~/components/dashboard/leads/bulk-actions-bar.vue";

definePageMeta({
  title: "Leads",
  layout: "dashboard",
});

const route = useRoute();
const workspaceId = route.params.workspaceId as string;

const workspaceStore = useWorkspaceStore();
workspaceStore.setCurrentWorkspace(workspaceId);

const leadsStore = useLeadsStore();

// ── Filters & search ───────────────────────────────────────────────────────
const searchQuery = ref("");
const filters = ref<LeadFilters>({
  stage: TenantLeadStage.New,
  sort_by: "priority_score",
  sort_dir: "desc",
});

// ── Selected lead ──────────────────────────────────────────────────────────
const selectedLeadId = ref<string | null>(null);

const handleShowDetail = async (leadId: string) => {
  selectedLeadId.value = leadId;
  await leadsStore.fetchLeadDetail(leadId, workspaceId);
  await Promise.all([
    leadsStore.fetchNotes(leadId, workspaceId),
    leadsStore.fetchTasks(leadId, workspaceId),
  ]);
};

const handleCloseDetail = () => {
  selectedLeadId.value = null;
};

// ── Apply/Reset filters ────────────────────────────────────────────────────
const applyFilters = async () => {
  leadsStore.searchQuery = searchQuery.value;
  await leadsStore.fetchLeads(workspaceId, { ...filters.value });
};

const resetFilters = async () => {
  filters.value = {
    stage: TenantLeadStage.New,
    sort_by: "priority_score",
    sort_dir: "desc",
  };
  searchQuery.value = "";
  leadsStore.searchQuery = "";
  await leadsStore.fetchLeads(workspaceId, { ...filters.value });
};

// ── Per-lead actions ───────────────────────────────────────────────────────
const handleTakeToWork = async (lead: TenantLeadListItem) => {
  await leadsStore.takeLead(lead.id, workspaceId);
};

const handleSnooze = async (lead: TenantLeadListItem, until: string) => {
  await leadsStore.snoozeLead(lead.id, workspaceId, until);
};

const handleHide = async (lead: TenantLeadListItem) => {
  await leadsStore.hideLead(lead.id, workspaceId);
  if (selectedLeadId.value === lead.id) handleCloseDetail();
};

const handleAssign = async (lead: TenantLeadListItem, memberId: string) => {
  await leadsStore.assignLead(lead.id, workspaceId, memberId);
};

const handleDelete = async (lead: TenantLeadListItem) => {
  await leadsStore.deleteLead(lead.id, workspaceId);
  if (selectedLeadId.value === lead.id) handleCloseDetail();
};

// ── Bulk actions ───────────────────────────────────────────────────────────
const handleBulkMove = async (toStage: TenantLeadStage) => {
  await leadsStore.bulkMove(
    workspaceId,
    Array.from(leadsStore.selectedIds),
    toStage,
  );
};

const handleBulkAssign = async (memberId: string | null) => {
  await leadsStore.bulkAssign(
    workspaceId,
    Array.from(leadsStore.selectedIds),
    memberId,
  );
};

// ── Detail panel actions ───────────────────────────────────────────────────
const handleCreateNote = async (text: string) => {
  if (!selectedLeadId.value) return;
  await leadsStore.createNote(selectedLeadId.value, workspaceId, text);
};

const handleCreateTask = async (data: CreateTaskRequest) => {
  if (!selectedLeadId.value) return;
  await leadsStore.createTask(selectedLeadId.value, workspaceId, data);
};

const handleCompleteTask = async (taskId: string) => {
  if (!selectedLeadId.value) return;
  await leadsStore.completeTask(selectedLeadId.value, taskId, workspaceId);
};

const handleTakeToWorkFromDetail = async (
  done?: (success: boolean) => void,
) => {
  if (!selectedLeadId.value) {
    done?.(false);
    return;
  }
  const success = await leadsStore.takeLead(selectedLeadId.value, workspaceId);
  done?.(success);
  if (!success) return;
  // Refresh lead detail to show updated stage
  await leadsStore.fetchLeadDetail(selectedLeadId.value, workspaceId);
};

// ── Refresh ────────────────────────────────────────────────────────────────
const isRefreshing = ref(false);

const handleRefresh = async () => {
  isRefreshing.value = true;
  await leadsStore.refreshLeads(workspaceId);
  await leadsStore.fetchLeads(workspaceId, { ...filters.value });
  isRefreshing.value = false;
};

// ── Init ───────────────────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([
    leadsStore.fetchLeads(workspaceId, { ...filters.value }),
    leadsStore.fetchMembers(workspaceId),
  ]);
});

provide("workspaceId", workspaceId);
</script>

<template>
  <div class="leads-page">
    <div class="leads-page__inner">
      <!-- ── Top bar ── -->
      <div class="leads-page__topbar">
        <div class="leads-page__topbar-left">
          <h1 class="leads-page__heading">Лиды</h1>
          <span v-if="!leadsStore.isLoading" class="leads-page__count">
            {{ leadsStore.filteredRawLeads.length }}
          </span>
        </div>

        <div class="leads-page__topbar-right">
          <button
            class="leads-page__icon-btn"
            title="Обновить лиды"
            :class="{ 'leads-page__icon-btn--spinning': isRefreshing }"
            @click="handleRefresh"
          >
            <Icon name="my-icon-refresh" mode="svg" :size="16" />
          </button>
        </div>
      </div>

      <!-- Filter bar -->
      <DashboardLeadsLeadFiltersBar
        v-model="filters"
        v-model:search-query="searchQuery"
        @apply="applyFilters"
        @reset="resetFilters"
      />

      <!-- Bulk actions bar (shown when items selected) -->
      <DashboardLeadsBulkActionsBar
        v-if="leadsStore.hasSelection"
        :selected-count="leadsStore.selectedCount"
        :members="leadsStore.members"
        @bulk-move="handleBulkMove"
        @bulk-assign="handleBulkAssign"
        @clear-selection="leadsStore.clearSelection"
      />

      <!-- Main area: table -->
      <div class="leads-page__main">
        <div class="leads-page__table-wrap">
          <DashboardLeadsLeadsTable
            :leads="leadsStore.filteredRawLeads"
            :selected-ids="leadsStore.selectedIds"
            :is-loading="leadsStore.isLoading"
            :has-more="leadsStore.hasMore"
            @select="leadsStore.toggleSelection"
            @select-all="leadsStore.selectAll"
            @clear-selection="leadsStore.clearSelection"
            @show-detail="handleShowDetail"
            @show-more="leadsStore.fetchMore"
          >
            <template #actions="{ lead }">
              <DashboardLeadsLeadActionsDropdown
                :lead="lead"
                :members="leadsStore.members"
                @take-to-work="handleTakeToWork(lead)"
                @snooze="(until) => handleSnooze(lead, until)"
                @hide="handleHide(lead)"
                @assign="(memberId) => handleAssign(lead, memberId)"
                @delete="handleDelete(lead)"
              />
            </template>
          </DashboardLeadsLeadsTable>
        </div>
      </div>

      <!-- Detail modal (teleported to body) -->
      <DashboardLeadsLeadDetailPanel
        :open="!!selectedLeadId"
        :lead="leadsStore.selectedLeadDetail"
        :is-loading="leadsStore.isLoadingDetail"
        :notes="leadsStore.notes"
        :tasks="leadsStore.tasks"
        :is-loading-notes="leadsStore.isLoadingNotes"
        :is-loading-tasks="leadsStore.isLoadingTasks"
        @close="handleCloseDetail"
        @create-note="handleCreateNote"
        @create-task="handleCreateTask"
        @complete-task="handleCompleteTask"
        @take-to-work="handleTakeToWorkFromDetail"
      />
    </div>
  </div>
</template>

<style scoped>
.leads-page {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 25px 40px;
  box-sizing: border-box;
  overflow: hidden;
}

.leads-page__inner {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 0;
}

/* ── Top bar ── */
.leads-page__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.leads-page__topbar-left {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.leads-page__heading {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-neutral-dd);
}

.leads-page__count {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-neutral-dl);
}

.leads-page__topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.leads-page__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-neutral-ld);
  border-radius: 10px;
  background: var(--color-neutral-ll);
  color: var(--color-neutral-dm);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.leads-page__icon-btn:hover {
  background: var(--color-primary);
  color: #fff;
  border-color: var(--color-primary);
}

.leads-page__icon-btn--spinning :deep(svg) {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Main (table + panel) ── */
.leads-page__main {
  display: flex;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.leads-page__table-wrap {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  overflow-x: auto;
  border-radius: 16px;
  scrollbar-width: thin;
  scrollbar-color: var(--color-neutral-ld) transparent;
}

/* ── Responsive ── */
@media (max-width: 1280px) {
  .leads-page {
    padding: 20px 24px;
  }
}

@media (max-width: 980px) {
  .leads-page__main {
    overflow-y: auto;
  }

  .leads-page__table-wrap {
    flex: none;
    height: auto;
    overflow: visible;
  }
}

@media (max-width: 700px) {
  .leads-page {
    padding: 16px;
  }

  .leads-page__topbar {
    flex-wrap: wrap;
  }
}
</style>
