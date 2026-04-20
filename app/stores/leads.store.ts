import type {
  TenantLeadListItem,
  LeadBranchRead,
} from "~/api/generated/api";
import { TenantLeadStage } from "~/api/generated/api";
import type {
  Lead,
  Branch,
  LeadSignals,
  Congestion,
  TaxPaymentYear,
  KgdSur,
} from "~/components/dashboard/leads/types";

const LIMIT = 10;

const STAGE_LABELS: Record<TenantLeadStage, string> = {
  [TenantLeadStage.New]: "Новый",
  [TenantLeadStage.Snoozed]: "Отложен",
  [TenantLeadStage.InProgress]: "В работе",
  [TenantLeadStage.FirstContact]: "Первый контакт",
  [TenantLeadStage.Negotiation]: "Переговоры",
  [TenantLeadStage.Contract]: "Договор",
  [TenantLeadStage.Monitoring]: "Мониторинг",
  [TenantLeadStage.Won]: "Выигран",
  [TenantLeadStage.Lost]: "Проигран",
  [TenantLeadStage.Hidden]: "Скрыт",
};

// ─── Congestion mapper ────────────────────────────────────────────────────────

function mapCongestion(raw: any): Congestion | undefined {
  if (!raw) return undefined;
  return {
    present: raw.present ?? false,
    peak_level: raw.peak_level ?? 0,
    avg_level: raw.avg_level ?? 0,
    peak_hours_count: raw.peak_hours_count ?? 0,
    evening_peak: raw.evening_peak ?? false,
    weekend_peak: raw.weekend_peak ?? false,
    levels: (raw.levels ?? []).map((l: any) => ({
      level: l.level,
      days: l.days ?? {},
    })),
  };
}

// ─── Branch mapper ────────────────────────────────────────────────────────────

function mapBranch(b: LeadBranchRead): Branch {
  return {
    id: b.id,
    name: b.name ?? '',
    fullAddress: b.full_address ?? '',
    isActive: b.is_active,
    rating: b.signals?.rating ?? undefined,
    reviewCount: b.signals?.review_count ?? undefined,
    congestion: mapCongestion(b.signals?.congestion),
  };
}

// ─── Signals mapper ───────────────────────────────────────────────────────────

function mapSignals(raw: TenantLeadListItem["signals"], ): LeadSignals | undefined {
  if (!raw) return undefined;
  return {
    rating: raw.rating ?? undefined,
    reviewCount: raw.review_count ?? undefined,
    hasDelivery: raw.has_delivery ?? undefined,
    is24x7: raw.is_24x7 ?? undefined,
    nearestStationDistance: raw.nearest_station_distance_m ?? undefined,
    nearestParkingCount: raw.nearest_parking_count ?? undefined,
  };
}

// ─── Tax payments mapper ──────────────────────────────────────────────────────

function mapTaxPayments(raw: any[] | null | undefined): TaxPaymentYear[] | undefined {
  if (!raw?.length) return undefined;
  return raw.map((y) => ({
    year: y.year,
    items: (y.items ?? []).map((item: any) => ({
      type: item.type,
      amount: item.amount,
    })),
  }));
}

// ─── KGD SUR mapper ───────────────────────────────────────────────────────────

function mapKgdSur(raw: any): KgdSur | undefined {
  if (!raw) return undefined;
  return {
    taxMode: raw.tax_mode ?? null,
    taxDebt: raw.tax_debt ?? null,
    vatRegistered: raw.vat_registered ?? null,
    statistics: (raw.statistics ?? []).map((s: any) => ({
      year: s.year,
      taxPaid: s.tax_paid,
      workersCount: s.workers_count,
      vatPaid: s.vat_paid,
    })),
  };
}

// ─── Lead mapper ──────────────────────────────────────────────────────────────

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

  const fitScores: Array<{ label: string; level: string }> = [];
  if (item.signals?.rating != null)
    fitScores.push({ label: "Рейтинг", level: String(item.signals.rating) });
  if (item.signals?.review_count != null)
    fitScores.push({ label: "Отзывы", level: String(item.signals.review_count) });
  if (item.signals?.branch_count != null)
    fitScores.push({ label: "Филиалы", level: String(item.signals.branch_count) });

  const locationParts = [
    item.address_city_name_ru,
    item.address_district_name_ru,
  ].filter(Boolean);

  return {
    id: item.id,
    score,
    openStatus: STAGE_LABELS[item.stage_code] ?? item.stage_code,

    // Display
    title: item.lead_name,
    subtitle: item.lead_business_category_name_ru,
    tags: [item.lead_business_category_name_ru].filter(Boolean),

    // Contact
    contacts: phones,
    email: emails[0] ?? "",
    phone: phones[0] ?? "",

    // Location
    address: item.address_full ?? "",
    locationShort: locationParts.join(", "),

    // Scoring
    fitScores,
    reasons: [],
    freshness:
        item.freshness_score != null
            ? `${Math.round(item.freshness_score * 100)}%`
            : "",

    // Raw scores (0–1)
    fitScore: item.fit_score ?? undefined,
    priorityScore: item.priority_score ?? undefined,
    freshnessScore: item.freshness_score ?? undefined,
    contactabilityScore: (item as any).contactability_score ?? undefined,
    businessPotentialScore: (item as any).business_potential_score ?? undefined,

    // Branches
    branches: (item.branches ?? []).map(mapBranch),

    // Signals, tax, KGD
    signals: mapSignals(item.signals),
    taxPayments: mapTaxPayments((item as any).tax_payments),
    kgdSur: mapKgdSur((item as any).kgd_sur),
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useLeadsStore = defineStore("leads", () => {
  const notification = useNotification();
  const { $apiClient } = useNuxtApp();

  const rawLeads = ref<TenantLeadListItem[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const hasMore = ref(true);
  const error = ref<string | null>(null);
  const currentWorkspaceId = ref<string | null>(null);

  const leads = computed<Lead[]>(() => rawLeads.value.map(mapToLead));

  function withLoading<T extends unknown[]>(fn: (...args: T) => Promise<void>) {
    return async (...args: T): Promise<boolean> => {
      isLoading.value = true;
      error.value = null;
      try {
        await fn(...args);
        return true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
        error.value = msg;
        notification.error("Ошибка", msg);
        return false;
      } finally {
        isLoading.value = false;
      }
    };
  }

  const fetchLeads = withLoading(async (workspaceId: string) => {
    currentWorkspaceId.value = workspaceId;
    const resp =
        await $apiClient.api.listTenantLeadsApiV1TenantsTenantIdLeadsGet(
            workspaceId,
            { offset: 0, limit: LIMIT },
        );
    rawLeads.value = resp.data.result;
    hasMore.value = resp.data.result.length >= LIMIT;
  });

  const fetchMore = async (): Promise<boolean> => {
    if (!hasMore.value || isLoadingMore.value || !currentWorkspaceId.value)
      return false;

    isLoadingMore.value = true;
    error.value = null;
    try {
      const resp =
          await $apiClient.api.listTenantLeadsApiV1TenantsTenantIdLeadsGet(
              currentWorkspaceId.value,
              { offset: rawLeads.value.length, limit: LIMIT },
          );
      rawLeads.value.push(...resp.data.result);
      hasMore.value = resp.data.result.length >= LIMIT;
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
      error.value = msg;
      notification.error("Ошибка", "Не удалось загрузить ещё лиды");
      return false;
    } finally {
      isLoadingMore.value = false;
    }
  };

  const postponeLead = async (
      leadId: string,
      workspaceId: string,
  ): Promise<boolean> => {
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
      notification.success("Успешно", "Лид отложен");
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
      error.value = msg;
      notification.error("Ошибка", "Не удалось отложить лид");
      return false;
    }
  };

  const takeLead = async (
      leadId: string,
      workspaceId: string,
  ): Promise<boolean> => {
    try {
      await $apiClient.api.moveLeadApiV1LeadsTenantLeadIdMovePost(
          leadId,
          { tenant_id: workspaceId },
          { to_stage: TenantLeadStage.InProgress },
      );
      const raw = rawLeads.value.find((l) => l.id === leadId);
      if (raw) raw.stage_code = TenantLeadStage.InProgress;
      notification.success("Успешно", "Лид взят в работу");
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Неизвестная ошибка";
      error.value = msg;
      notification.error("Ошибка", "Не удалось взять лид в работу");
      return false;
    }
  };

  const clearLeads = () => {
    rawLeads.value = [];
    hasMore.value = true;
    currentWorkspaceId.value = null;
    error.value = null;
  };

  return {
    leads,
    rawLeads,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    currentWorkspaceId,
    fetchLeads,
    fetchMore,
    postponeLead,
    takeLead,
    clearLeads,
  };
});