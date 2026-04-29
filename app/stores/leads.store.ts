import type {
  TenantLeadListItem,
  LeadBranchRead,
  TenantLeadDetail,
  CreateTaskRequest,
  TenantMemberBrief,
  TenantMemberRead,
} from "~/api/generated/api";
import { TenantLeadStage } from "~/api/generated/api";
import type {
  Lead,
  LeadFit,
  LeadBranch,
} from "~/components/dashboard/leads/types";
import { getLocalizedField, type LocalizedRecord } from "~/utils/localized";

const LIMIT = 10;

const STAGE_I18N_KEYS: Record<TenantLeadStage, string> = {
  [TenantLeadStage.New]: "leads.new",
  [TenantLeadStage.Snoozed]: "leads.snoozed",
  [TenantLeadStage.InProgress]: "leads.inProgress",
  [TenantLeadStage.FirstContact]: "leads.firstContact",
  [TenantLeadStage.Negotiation]: "leads.negotiation",
  [TenantLeadStage.Contract]: "leads.contract",
  [TenantLeadStage.Monitoring]: "leads.monitoring",
  [TenantLeadStage.Won]: "leads.won",
  [TenantLeadStage.Lost]: "leads.lost",
  [TenantLeadStage.Hidden]: "leads.hidden",
};

export function getLeadStageLabel(
  stage: TenantLeadStage,
  t: (key: string) => string,
) {
  return t(STAGE_I18N_KEYS[stage]);
}

export function getLeadStageOptions(t: (key: string) => string) {
  return Object.values(TenantLeadStage).map((value) => ({
    value,
    label: getLeadStageLabel(value, t),
  }));
}

export function getLeadSortOptions(t: (key: string) => string) {
  return [
    { value: "priority_score", label: t("leads.priority") },
    { value: "fit_score", label: t("leads.fit") },
    { value: "freshness_score", label: t("leads.freshness") },
    { value: "contactability_score", label: t("leads.contactability") },
    { value: "created_at", label: t("leads.table.date") },
  ] as const;
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

type LeadListStateItem = TenantLeadListItem & {
  snoozed_until?: string | null;
  hidden_until?: string | null;
};

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
  const { $apiClient, $i18n } = useNuxtApp();
  const t = (key: string, params?: Record<string, unknown>) => $i18n.t(key, params ?? {});
  const locale = computed(() => $i18n.locale.value);

  const stageLabels = computed<Record<TenantLeadStage, string>>(() => ({
    [TenantLeadStage.New]: getLeadStageLabel(TenantLeadStage.New, t),
    [TenantLeadStage.Snoozed]: getLeadStageLabel(TenantLeadStage.Snoozed, t),
    [TenantLeadStage.InProgress]: getLeadStageLabel(TenantLeadStage.InProgress, t),
    [TenantLeadStage.FirstContact]: getLeadStageLabel(TenantLeadStage.FirstContact, t),
    [TenantLeadStage.Negotiation]: getLeadStageLabel(TenantLeadStage.Negotiation, t),
    [TenantLeadStage.Contract]: getLeadStageLabel(TenantLeadStage.Contract, t),
    [TenantLeadStage.Monitoring]: getLeadStageLabel(TenantLeadStage.Monitoring, t),
    [TenantLeadStage.Won]: getLeadStageLabel(TenantLeadStage.Won, t),
    [TenantLeadStage.Lost]: getLeadStageLabel(TenantLeadStage.Lost, t),
    [TenantLeadStage.Hidden]: getLeadStageLabel(TenantLeadStage.Hidden, t),
  }));

  const getStageLabel = (stage: TenantLeadStage) =>
    stageLabels.value[stage] ?? stage;

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
    if (item.signals?.rating != null) {
      fitScores.push({ label: t("leads.rating"), level: String(item.signals.rating) });
    }
    if (item.signals?.review_count != null) {
      fitScores.push({
        label: t("leads.reviews"),
        level: String(item.signals.review_count),
      });
    }
    if (item.signals?.branch_count != null) {
      fitScores.push({
        label: t("leads.branches"),
        level: String(item.signals.branch_count),
      });
    }

    const locationParts = [
      getLocalizedField(item as unknown as LocalizedRecord, "address_city_name", locale.value),
      getLocalizedField(item as unknown as LocalizedRecord, "address_district_name", locale.value),
    ].filter(Boolean);

    const categoryLabel = getLocalizedField(
      item as unknown as LocalizedRecord,
      "lead_business_category_name",
      locale.value,
    );

    const branches: LeadBranch[] = (item.branches ?? []).map(
      (b: LeadBranchRead) => ({
        id: b.id,
        name: b.name ?? "",
        fullAddress: b.full_address ?? "",
        isActive: b.is_active,
        rating: b.signals?.rating ?? 0,
        reviewCount: b.signals?.review_count ?? 0,
      }),
    );

    return {
      id: item.id,
      score,
      title: item.lead_name,
      subtitle: categoryLabel,
      tags: categoryLabel ? [categoryLabel] : [],
      address: item.address_full ?? "",
      phone: phones[0] ?? "",
      openStatus: getStageLabel(item.stage_code),
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

  // ─── List state ───────────────────────────────────────────────────────────
  const rawLeads = ref<LeadListStateItem[]>([]);
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

  const filteredRawLeads = computed<LeadListStateItem[]>(() => {
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
        getLocalizedField(lead, "lead_business_category_name", locale.value),
        lead.address_full,
        getLocalizedField(lead, "address_city_name", locale.value),
        getLocalizedField(lead, "address_district_name", locale.value),
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
      totalCount.value = resp.data.meta?.pagination?.total ?? resp.data.result.length;
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
        t("leads.moveLeadSuccess", { stage: getStageLabel(toStage) }),
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
          stage: getStageLabel(toStage),
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
      members.value = resp.data.result.map((member: TenantMemberRead) => ({
        id: member.id,
        user_id: member.user_id,
        user_email: member.email ?? "",
        user_full_name:
          [member.first_name, member.last_name].filter(Boolean).join(" ").trim() ||
          member.email ||
          null,
      }));
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
