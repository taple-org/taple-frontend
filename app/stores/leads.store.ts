import type {
  TenantLeadListItem,
  LeadBranchRead,
  TenantLeadDetail,
  CreateTaskRequest,
  TenantMemberBrief,
} from "~/api/generated/api";
import { TenantLeadStage } from "~/api/generated/api";
import type {
  Lead,
  LeadFit,
  LeadBranch,
} from "~/components/dashboard/leads/types";

const LIMIT = 10;

export const STAGE_LABELS: Record<TenantLeadStage, string> = {
  [TenantLeadStage.New]: "Новый",
  [TenantLeadStage.Snoozed]: "Отложен",
  [TenantLeadStage.InProgress]: "В работе",
  [TenantLeadStage.FirstContact]: "Первый контакт",
  [TenantLeadStage.Negotiation]: "Переговоры",
  [TenantLeadStage.Contract]: "Заключение Договора",
  [TenantLeadStage.Monitoring]: "Мониторинг",
  [TenantLeadStage.Won]: "Выигран",
  [TenantLeadStage.Lost]: "Проигран",
  [TenantLeadStage.Hidden]: "Скрыт",
};

export const STAGE_OPTIONS = Object.entries(STAGE_LABELS).map(
  ([value, label]) => ({ value: value as TenantLeadStage, label }),
);

export const SORT_OPTIONS = [
  { value: "priority_score", label: "Приоритет" },
  { value: "fit_score", label: "Соответствие" },
  { value: "freshness_score", label: "Свежесть" },
  { value: "contactability_score", label: "Доступность" },
  { value: "created_at", label: "Дата создания" },
] as const;

function mapToLead(item: TenantLeadListItem): Lead {
  const contacts = item.contacts ?? [];

  const phones = contacts
    .filter((c) => c.type === "phone")
    .map((c) => c.value ?? "")
    .filter(Boolean);

  const emails = contacts
    .filter((c) => c.type === "email")
    .map((c) => c.value ?? "")
    .filter(Boolean);

  const score = Math.round((item.priority_score ?? item.fit_score ?? 0) * 100);

  const fitScores: LeadFit[] = [];
  if (item.signals?.rating != null)
    fitScores.push({ label: "Рейтинг", level: String(item.signals.rating) });
  if (item.signals?.review_count != null)
    fitScores.push({
      label: "Отзывы",
      level: String(item.signals.review_count),
    });
  if (item.signals?.branch_count != null)
    fitScores.push({
      label: "Филиалы",
      level: String(item.signals.branch_count),
    });

  const locationParts = [
    item.address_city_name_ru,
    item.address_district_name_ru,
  ].filter(Boolean);

  const branches: LeadBranch[] = (item.branches ?? []).map(
    (b: LeadBranchRead) => ({
      id: b.id,
      name: b.name,
      fullAddress: b.full_address,
      isActive: b.is_active,
      rating: b.signals?.rating,
      reviewCount: b.signals?.review_count,
    }),
  );

  return {
    id: item.id,
    score,
    title: item.lead_name,
    subtitle: item.lead_business_category_name_ru,
    tags: [item.lead_business_category_name_ru],
    address: item.address_full ?? "",
    phone: phones[0] ?? "",
    openStatus: STAGE_LABELS[item.stage_code] ?? item.stage_code,
    contacts: phones,
    email: emails[0] ?? "",
    locationShort: locationParts.join(", "),
    fitScores,
    reasons: [],
    freshness:
      item.freshness_score != null
        ? `${Math.round(item.freshness_score * 100)}%`
        : "",
    branches,
  };
}

export interface LeadFilters {
  stage?: TenantLeadStage | null;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  min_fit_score?: number | null;
  max_fit_score?: number | null;
  min_priority_score?: number | null;
  max_priority_score?: number | null;
  responsible_member_id?: string | null;
}

const buildLeadListParams = (
  filterValues: LeadFilters,
  offset: number,
): Record<string, unknown> => ({
  offset,
  limit: LIMIT,
  ...(filterValues.stage ? { stage: filterValues.stage } : {}),
  ...(filterValues.sort_by ? { sort_by: filterValues.sort_by } : {}),
  ...(filterValues.sort_dir ? { sort_dir: filterValues.sort_dir } : {}),
  ...(filterValues.min_fit_score != null
    ? { min_fit_score: filterValues.min_fit_score }
    : {}),
  ...(filterValues.max_fit_score != null
    ? { max_fit_score: filterValues.max_fit_score }
    : {}),
  ...(filterValues.min_priority_score != null
    ? { min_priority_score: filterValues.min_priority_score }
    : {}),
  ...(filterValues.max_priority_score != null
    ? { max_priority_score: filterValues.max_priority_score }
    : {}),
  ...(filterValues.responsible_member_id
    ? { responsible_member_id: filterValues.responsible_member_id }
    : {}),
});

export const useLeadsStore = defineStore("leads", () => {
  const notification = useNotification();
  const { $apiClient } = useNuxtApp();
  const { t } = useI18n();

  // ─── List state ───────────────────────────────────────────────────────────
  const rawLeads = ref<TenantLeadListItem[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const hasMore = ref(true);
  const error = ref<string | null>(null);
  const currentWorkspaceId = ref<string | null>(null);
  const totalCount = ref(0);
  const filters = ref<LeadFilters>({});

  // ─── Detail state ─────────────────────────────────────────────────────────
  const selectedLeadDetail = ref<TenantLeadDetail | null>(null);
  const isLoadingDetail = ref(false);

  // ─── Members state ────────────────────────────────────────────────────────
  const members = ref<TenantMemberBrief[]>([]);

  // ─── Notes state ──────────────────────────────────────────────────────────
  const notes = ref<any[]>([]);
  const isLoadingNotes = ref(false);

  // ─── Tasks state ──────────────────────────────────────────────────────────
  const tasks = ref<any[]>([]);
  const isLoadingTasks = ref(false);

  // ─── Bulk selection ───────────────────────────────────────────────────────
  const selectedIds = ref<Set<string>>(new Set());

  // ─── Search ───────────────────────────────────────────────────────────────
  const searchQuery = ref<string>("");

  // ─── Computed ─────────────────────────────────────────────────────────────
  const leads = computed<Lead[]>(() => rawLeads.value.map(mapToLead));

  const filteredRawLeads = computed<TenantLeadListItem[]>(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return rawLeads.value;

    return rawLeads.value.filter((lead) => {
      const phones =
        lead.contacts
          ?.filter((c) => c.type === "phone")
          .map((c) => c.value)
          .join(" ") ?? "";
      const emails =
        lead.contacts
          ?.filter((c) => c.type === "email")
          .map((c) => c.value)
          .join(" ") ?? "";

      const searchableText = [
        lead.lead_name,
        lead.lead_business_category_name_ru,
        lead.address_full,
        lead.address_city_name_ru,
        lead.address_district_name_ru,
        phones,
        emails,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  });

  const hasSelection = computed(() => selectedIds.value.size > 0);
  const selectedCount = computed(() => selectedIds.value.size);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function withLoading<T extends unknown[]>(fn: (...args: T) => Promise<void>) {
    return async (...args: T): Promise<boolean> => {
      isLoading.value = true;
      error.value = null;
      try {
        await fn(...args);
        return true;
      } catch (e: unknown) {
        if (e instanceof Error) {
          error.value = e.message;
          notification.error(t("common.error"), e.message);
        } else {
          error.value = t("leads.unknownError");
          notification.error(t("common.error"), t("leads.unknownError"));
        }
        return false;
      } finally {
        isLoading.value = false;
      }
    };
  }

  // ─── List actions ─────────────────────────────────────────────────────────
  const fetchLeads = withLoading(
    async (workspaceId: string, opts?: LeadFilters) => {
      currentWorkspaceId.value = workspaceId;
      if (opts) filters.value = opts;

      const resp =
        await $apiClient.api.listTenantLeadsApiV1TenantsTenantIdLeadsGet(
          workspaceId,
          buildLeadListParams(filters.value, 0),
        );
      rawLeads.value = resp.data.result;
      totalCount.value = resp.data.meta?.total ?? resp.data.result.length;
      hasMore.value = resp.data.result.length >= LIMIT;
    },
  );

  const fetchMore = async () => {
    if (!hasMore.value || isLoadingMore.value || !currentWorkspaceId.value)
      return false;

    isLoadingMore.value = true;
    error.value = null;
    try {
      const resp =
        await $apiClient.api.listTenantLeadsApiV1TenantsTenantIdLeadsGet(
          currentWorkspaceId.value,
          buildLeadListParams(filters.value, rawLeads.value.length),
        );
      rawLeads.value.push(...resp.data.result);
      hasMore.value = resp.data.result.length >= LIMIT;
      return true;
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message;
        notification.error(t("common.error"), t("leads.loadMoreError"));
      } else {
        notification.error(t("common.error"), t("leads.loadMoreError"));
      }
      return false;
    } finally {
      isLoadingMore.value = false;
    }
  };

  // ─── Detail actions ───────────────────────────────────────────────────────
  const fetchLeadDetail = async (leadId: string, workspaceId: string) => {
    isLoadingDetail.value = true;
    try {
      const resp =
        await $apiClient.api.getTenantLeadDetailApiV1LeadsTenantLeadIdGet(
          leadId,
          { tenant_id: workspaceId },
        );
      selectedLeadDetail.value = resp.data.result;
    } catch (e) {
      notification.error(t("common.error"), t("leads.fetchDetailError"));
    } finally {
      isLoadingDetail.value = false;
    }
  };

  // ─── Lead actions ─────────────────────────────────────────────────────────
  const moveLead = async (
    leadId: string,
    workspaceId: string,
    toStage: TenantLeadStage,
    comment?: string,
  ) => {
    try {
      await $apiClient.api.moveLeadApiV1LeadsTenantLeadIdMovePost(
        leadId,
        { tenant_id: workspaceId },
        { to_stage: toStage, ...(comment ? { comment } : {}) },
      );
      const raw = rawLeads.value.find((l) => l.id === leadId);
      if (raw) raw.stage_code = toStage;
      if (selectedLeadDetail.value?.id === leadId)
        selectedLeadDetail.value.stage_code = toStage;
      notification.success(
        t("common.success"),
        t("leads.moveLeadSuccess", { stage: STAGE_LABELS[toStage] }),
      );
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.moveLeadError"));
      return false;
    }
  };

  const postponeLead = async (leadId: string, workspaceId: string) => {
    const snoozed_until = new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19);
    try {
      await $apiClient.api.snoozeLeadApiV1LeadsTenantLeadIdSnoozePost(
        leadId,
        { tenant_id: workspaceId },
        { snoozed_until },
      );
      const lead = rawLeads.value.find((l) => l.id === leadId);
      if (lead) lead.stage_code = TenantLeadStage.Snoozed;
      if (selectedLeadDetail.value?.id === leadId)
        selectedLeadDetail.value.stage_code = TenantLeadStage.Snoozed;
      notification.success(t("common.success"), t("leads.postponeLeadSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.postponeLeadError"));
      return false;
    }
  };

  const snoozeLead = async (
    leadId: string,
    workspaceId: string,
    snoozedUntil: string,
  ) => {
    try {
      await $apiClient.api.snoozeLeadApiV1LeadsTenantLeadIdSnoozePost(
        leadId,
        { tenant_id: workspaceId },
        { snoozed_until: snoozedUntil },
      );
      const lead = rawLeads.value.find((l) => l.id === leadId);
      if (lead) {
        lead.stage_code = TenantLeadStage.Snoozed;
        lead.snoozed_until = snoozedUntil;
      }
      if (selectedLeadDetail.value?.id === leadId) {
        selectedLeadDetail.value.stage_code = TenantLeadStage.Snoozed;
        selectedLeadDetail.value.snoozed_until = snoozedUntil;
      }
      notification.success(t("common.success"), t("leads.postponeLeadSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.postponeLeadError"));
      return false;
    }
  };

  const hideLead = async (leadId: string, workspaceId: string) => {
    try {
      await $apiClient.api.hideLeadApiV1LeadsTenantLeadIdHidePost(leadId, {
        tenant_id: workspaceId,
      });
      const lead = rawLeads.value.find((l) => l.id === leadId);
      if (lead) lead.stage_code = TenantLeadStage.Hidden;
      if (selectedLeadDetail.value?.id === leadId)
        selectedLeadDetail.value.stage_code = TenantLeadStage.Hidden;
      notification.success(t("common.success"), t("leads.hideLeadSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.hideLeadError"));
      return false;
    }
  };

  const assignLead = async (
    leadId: string,
    workspaceId: string,
    memberId: string,
  ) => {
    try {
      await $apiClient.api.assignLeadApiV1LeadsTenantLeadIdAssignPost(
        leadId,
        { tenant_id: workspaceId },
        { member_id: memberId },
      );
      notification.success(t("common.success"), t("leads.assignLeadSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.assignLeadError"));
      return false;
    }
  };

  const deleteLead = async (leadId: string, workspaceId: string) => {
    try {
      await $apiClient.api.deleteLeadApiV1LeadsTenantLeadIdDelete(leadId, {
        tenant_id: workspaceId,
      });
      rawLeads.value = rawLeads.value.filter((l) => l.id !== leadId);
      if (selectedLeadDetail.value?.id === leadId)
        selectedLeadDetail.value = null;
      notification.success(t("common.success"), t("leads.deleteLeadSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.deleteLeadError"));
      return false;
    }
  };

  const takeLead = async (leadId: string, workspaceId: string) => {
    try {
      await $apiClient.api.moveLeadApiV1LeadsTenantLeadIdMovePost(
        leadId,
        { tenant_id: workspaceId },
        { to_stage: TenantLeadStage.InProgress },
      );
      const raw = rawLeads.value.find((l) => l.id === leadId);
      if (raw) raw.stage_code = TenantLeadStage.InProgress;
      if (selectedLeadDetail.value?.id === leadId)
        selectedLeadDetail.value.stage_code = TenantLeadStage.InProgress;
      notification.success(t("common.success"), t("leads.takeLeadSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.takeLeadError"));
      return false;
    }
  };

  // ─── Bulk actions ─────────────────────────────────────────────────────────
  const bulkMove = async (
    workspaceId: string,
    leadIds: string[],
    toStage: TenantLeadStage,
  ) => {
    try {
      await $apiClient.api.bulkMoveApiV1LeadsBulkMovePost(
        { tenant_id: workspaceId },
        { tenant_lead_ids: leadIds, to_stage: toStage },
      );
      leadIds.forEach((id) => {
        const lead = rawLeads.value.find((l) => l.id === id);
        if (lead) lead.stage_code = toStage;
      });
      selectedIds.value.clear();
      notification.success(
        t("common.success"),
        t("leads.bulkMoveSuccess", {
          count: leadIds.length,
          stage: STAGE_LABELS[toStage],
        }),
      );
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.bulkMoveError"));
      return false;
    }
  };

  const bulkAssign = async (
    workspaceId: string,
    leadIds: string[],
    memberId: string | null,
  ) => {
    try {
      await $apiClient.api.bulkAssignApiV1LeadsBulkAssignPost(
        { tenant_id: workspaceId },
        { tenant_lead_ids: leadIds, member_id: memberId },
      );
      notification.success(
        t("common.success"),
        t("leads.bulkAssignSuccess", { count: leadIds.length }),
      );
      selectedIds.value.clear();
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.bulkAssignError"));
      return false;
    }
  };

  // ─── Members ──────────────────────────────────────────────────────────────
  const fetchMembers = async (workspaceId: string) => {
    try {
      const resp =
        await $apiClient.api.listMembersApiV1TenantsTenantIdMembersGet(
          workspaceId,
        );
      members.value = resp.data.result;
    } catch {
      // non-critical, silently fail
    }
  };

  // ─── Notes ────────────────────────────────────────────────────────────────
  const fetchNotes = async (leadId: string, workspaceId: string) => {
    isLoadingNotes.value = true;
    try {
      const resp = await $apiClient.api.listNotesApiV1LeadsTenantLeadIdNotesGet(
        leadId,
        {
          tenant_id: workspaceId,
        },
      );
      notes.value = resp.data.result;
    } catch {
      notification.error(t("common.error"), t("leads.fetchNotesError"));
    } finally {
      isLoadingNotes.value = false;
    }
  };

  const createNote = async (
    leadId: string,
    workspaceId: string,
    text: string,
  ) => {
    try {
      const resp =
        await $apiClient.api.createNoteApiV1LeadsTenantLeadIdNotesPost(
          leadId,
          { tenant_id: workspaceId },
          { note: text },
        );
      notes.value.unshift(resp.data.result);
      notification.success(t("common.success"), t("leads.createNoteSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.createNoteError"));
      return false;
    }
  };

  // ─── Tasks ────────────────────────────────────────────────────────────────
  const fetchTasks = async (leadId: string, workspaceId: string) => {
    isLoadingTasks.value = true;
    try {
      const resp = await $apiClient.api.listTasksApiV1LeadsTenantLeadIdTasksGet(
        leadId,
        {
          tenant_id: workspaceId,
        },
      );
      tasks.value = resp.data.result;
    } catch {
      notification.error(t("common.error"), t("leads.fetchTasksError"));
    } finally {
      isLoadingTasks.value = false;
    }
  };

  const createTask = async (
    leadId: string,
    workspaceId: string,
    data: CreateTaskRequest,
  ) => {
    try {
      const resp =
        await $apiClient.api.createTaskApiV1LeadsTenantLeadIdTasksPost(
          leadId,
          { tenant_id: workspaceId },
          data,
        );
      tasks.value.unshift(resp.data.result);
      notification.success(t("common.success"), t("leads.createTaskSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.createTaskError"));
      return false;
    }
  };

  const completeTask = async (
    leadId: string,
    taskId: string,
    workspaceId: string,
  ) => {
    try {
      await $apiClient.api.completeTaskApiV1LeadsTenantLeadIdTasksTaskIdCompletePost(
        leadId,
        taskId,
        { tenant_id: workspaceId },
        {},
      );
      const task = tasks.value.find((t: any) => t.id === taskId);
      if (task) task.completed_at = new Date().toISOString();
      notification.success(t("common.success"), t("leads.completeTaskSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.completeTaskError"));
      return false;
    }
  };

  // ─── Export & Refresh ─────────────────────────────────────────────────────
  const exportLeads = async (workspaceId: string) => {
    try {
      const resp = await $apiClient.api.exportLeadsApiV1LeadsExportGet({
        tenant_id: workspaceId,
        ...(filters.value.stage ? { stage: filters.value.stage } : {}),
      });
      // Trigger file download
      const blob = new Blob([resp.data as any], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      notification.success(t("common.success"), t("leads.exportSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.exportError"));
      return false;
    }
  };

  const refreshLeads = async (workspaceId: string) => {
    try {
      await $apiClient.api.refreshTenantLeadsApiV1TenantsTenantIdRefreshLeadsPost(
        workspaceId,
      );
      notification.success(t("common.success"), t("leads.refreshSuccess"));
      return true;
    } catch {
      notification.error(t("common.error"), t("leads.refreshError"));
      return false;
    }
  };

  // ─── Selection helpers ────────────────────────────────────────────────────
  const toggleSelection = (id: string) => {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id);
    } else {
      selectedIds.value.add(id);
    }
  };

  const selectAll = () => {
    rawLeads.value.forEach((l) => selectedIds.value.add(l.id));
  };

  const clearSelection = () => {
    selectedIds.value.clear();
  };

  const clearLeads = () => {
    rawLeads.value = [];
    hasMore.value = true;
    currentWorkspaceId.value = null;
    error.value = null;
    selectedIds.value.clear();
  };

  return {
    // state
    leads,
    rawLeads,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    currentWorkspaceId,
    totalCount,
    filters,
    selectedLeadDetail,
    isLoadingDetail,
    members,
    notes,
    isLoadingNotes,
    tasks,
    isLoadingTasks,
    selectedIds,
    hasSelection,
    selectedCount,
    searchQuery,

    // actions
    // Getters
    filteredRawLeads,

    // Actions
    fetchLeads,
    fetchMore,
    fetchLeadDetail,
    moveLead,
    postponeLead,
    snoozeLead,
    hideLead,
    assignLead,
    deleteLead,
    takeLead,
    bulkMove,
    bulkAssign,
    fetchMembers,
    fetchNotes,
    createNote,
    fetchTasks,
    createTask,
    completeTask,
    exportLeads,
    refreshLeads,
    toggleSelection,
    selectAll,
    clearSelection,
    clearLeads,
  };
});
