import {
  TenantMerchantMonitoringStatus,
  type MerchantListItem,
  type TenantMemberBrief,
} from "~/api/generated/api";

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

export const MONITORING_STATUS_LABELS: Record<TenantMerchantMonitoringStatus, string> = {
  [TenantMerchantMonitoringStatus.Pending]: "Ожидают",
  [TenantMerchantMonitoringStatus.Monitoring]: "На Мониторинге",
  [TenantMerchantMonitoringStatus.Attention]: "Требуют внимания",
  [TenantMerchantMonitoringStatus.Success]: "Успешно",
  [TenantMerchantMonitoringStatus.Recall]: "Перезвонить",
  [TenantMerchantMonitoringStatus.Closed]: "Отказ от Лида",
  [TenantMerchantMonitoringStatus.Other]: "Другое",
};

export const MONITORING_STATUS_OPTIONS = [
  { value: "", label: "Все статусы" },
  ...MONITORING_STATUS_ORDER.map((status) => ({
    value: status,
    label: MONITORING_STATUS_LABELS[status],
  })),
];

export function groupMonitoringColumns(items: MerchantListItem[]): MonitoringColumn[] {
  return MONITORING_STATUS_ORDER.map((status) => {
    const cards = items.filter((item) => item.monitoring_status === status);

    return {
      status,
      label: MONITORING_STATUS_LABELS[status],
      count: cards.length,
      cards,
    };
  });
}

export function formatMonitoringDate(value?: string | null) {
  if (!value) return "Без срока";

  return new Date(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
}

export function getResponsibleLabel(member?: TenantMemberBrief | null) {
  return member?.user_full_name || member?.user_email || "Не назначено";
}
