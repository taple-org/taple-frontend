import {
  TenantMerchantMonitoringStatus,
  type MerchantListItem,
  type TenantMemberBrief,
} from "~/api/generated/api";

type Translate = (key: string, params?: Record<string, unknown>) => string;

export type MonitoringColumn = {
  status: TenantMerchantMonitoringStatus;
  label: string;
  count: number;
  cards: MerchantListItem[];
};

export const MONITORING_STATUS_ORDER: TenantMerchantMonitoringStatus[] = [
  TenantMerchantMonitoringStatus.Monitoring,
  TenantMerchantMonitoringStatus.Attention,
  TenantMerchantMonitoringStatus.Success,
  TenantMerchantMonitoringStatus.Closed,
];

const MONITORING_STATUS_KEYS: Record<TenantMerchantMonitoringStatus, string> = {
  [TenantMerchantMonitoringStatus.Pending]: "monitoring.status.pending",
  [TenantMerchantMonitoringStatus.Monitoring]: "monitoring.status.monitoring",
  [TenantMerchantMonitoringStatus.Attention]: "monitoring.status.attention",
  [TenantMerchantMonitoringStatus.Success]: "monitoring.status.success",
  [TenantMerchantMonitoringStatus.Recall]: "monitoring.status.recall",
  [TenantMerchantMonitoringStatus.Closed]: "monitoring.status.closed",
  [TenantMerchantMonitoringStatus.Other]: "monitoring.status.other",
};

export function getMonitoringStatusLabel(
  status: TenantMerchantMonitoringStatus,
  t: Translate,
) {
  return t(MONITORING_STATUS_KEYS[status]);
}

export function getMonitoringStatusOptions(t: Translate) {
  return [
    { value: "", label: t("monitoring.status.all") },
    ...MONITORING_STATUS_ORDER.map((status) => ({
      value: status,
      label: getMonitoringStatusLabel(status, t),
    })),
  ];
}

export function groupMonitoringColumns(
  items: MerchantListItem[],
  t: Translate,
): MonitoringColumn[] {
  return MONITORING_STATUS_ORDER.map((status) => {
    const cards = items.filter((item) => item.monitoring_status === status);

    return {
      status,
      label: getMonitoringStatusLabel(status, t),
      count: cards.length,
      cards,
    };
  });
}

export function formatMonitoringDate(
  value: string | null | undefined,
  locale: string,
  t: Translate,
) {
  if (!value) return t("tasks.noDeadline");

  return new Date(value).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
  });
}

export function getResponsibleLabel(
  member: TenantMemberBrief | null | undefined,
  t: Translate,
) {
  return member?.user_full_name || member?.user_email || t("common.unassigned");
}
