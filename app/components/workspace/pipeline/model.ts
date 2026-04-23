import {
  TenantLeadStage,
  type PipelineCardItem,
  type StageColumn,
  type TaskBadge,
  type TenantMemberBrief,
} from "~/api/generated/api";

export type PipelineTaskBadgeTone = "primary" | "warning" | "error" | "success" | "neutral";
export type PipelineBoardActionId =
  | TenantLeadStage.Monitoring
  | TenantLeadStage.Lost
  | TenantLeadStage.Snoozed
  | TenantLeadStage.Hidden;

export type PipelineBoardActionSection = {
  id: string;
  title: string;
  description: string;
  actions: Array<{
    id: PipelineBoardActionId;
    label: string;
    tone: "default" | "warning" | "success" | "danger";
  }>;
};

export const PIPELINE_STAGE_ORDER: TenantLeadStage[] = [
  TenantLeadStage.New,
  TenantLeadStage.InProgress,
  TenantLeadStage.FirstContact,
  TenantLeadStage.Negotiation,
  TenantLeadStage.Contract,
  TenantLeadStage.Monitoring,
  TenantLeadStage.Won,
  TenantLeadStage.Lost,
  TenantLeadStage.Snoozed,
  TenantLeadStage.Hidden,
];

export const PIPELINE_STAGE_LABELS: Record<TenantLeadStage, string> = {
  [TenantLeadStage.New]: "Новые",
  [TenantLeadStage.Snoozed]: "Отложено",
  [TenantLeadStage.InProgress]: "В работе",
  [TenantLeadStage.FirstContact]: "Первичный Контакт",
  [TenantLeadStage.Negotiation]: "Переговоры",
  [TenantLeadStage.Contract]: "Заключение Договора",
  [TenantLeadStage.Monitoring]: "Мониторинг",
  [TenantLeadStage.Won]: "Успешно",
  [TenantLeadStage.Lost]: "Потеряно",
  [TenantLeadStage.Hidden]: "Скрыто",
};

export const PIPELINE_STAGE_OPTIONS = PIPELINE_STAGE_ORDER.map((stage) => ({
  value: stage,
  label: PIPELINE_STAGE_LABELS[stage],
}));

export const PIPELINE_VISIBLE_STAGE_ORDER: TenantLeadStage[] = [
  TenantLeadStage.InProgress,
  TenantLeadStage.FirstContact,
  TenantLeadStage.Negotiation,
  TenantLeadStage.Contract,
];

export const PIPELINE_ACTION_SECTIONS: PipelineBoardActionSection[] = [
  {
    id: "next",
    title: "Перемещение",
    description: "Скрытые стадии вне основной доски",
    actions: [
      { id: TenantLeadStage.Monitoring, label: "Мониторинг", tone: "default" },
      { id: TenantLeadStage.Snoozed, label: "Отложить", tone: "warning" },
      { id: TenantLeadStage.Hidden, label: "Скрыть", tone: "default" },
      { id: TenantLeadStage.Lost, label: "Потеряно", tone: "danger" },
    ],
  },
];

export function normalizePipelineColumns(columns: StageColumn[]) {
  const mapped = new Map(columns.map((column) => [column.stage_code, column]));

  return PIPELINE_VISIBLE_STAGE_ORDER.map((stage) => {
    const existing = mapped.get(stage);
    if (existing) return existing;

    return {
      stage_code: stage,
      stage_name_en: stage,
      stage_name_ru: PIPELINE_STAGE_LABELS[stage],
      total_count: 0,
      cards: [],
    };
  });
}

export function formatPipelineDate(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
  });
}

export function getResponsibleLabel(member?: TenantMemberBrief | null) {
  return member?.user_full_name || member?.user_email || "Не назначено";
}

export function getTaskBadgeItems(taskBadge?: TaskBadge | null) {
  if (!taskBadge?.total) {
    return [{ label: "Нет задач", tone: "neutral" as PipelineTaskBadgeTone }];
  }

  const items = [{ label: `${taskBadge.total} задач`, tone: "primary" as PipelineTaskBadgeTone }];

  if (taskBadge.open) {
    items.push({ label: `${taskBadge.open} open`, tone: "warning" as PipelineTaskBadgeTone });
  }
  if (taskBadge.overdue) {
    items.push({ label: `${taskBadge.overdue} overdue`, tone: "error" as PipelineTaskBadgeTone });
  }
  if (taskBadge.completed) {
    items.push({ label: `${taskBadge.completed} done`, tone: "success" as PipelineTaskBadgeTone });
  }

  return items;
}

export function getPipelineCardTone(card: PipelineCardItem) {
  if (card.task_badge?.overdue) return "danger";
  if (card.task_badge?.open) return "warning";
  if (card.stage_code === TenantLeadStage.Won) return "success";
  return "default";
}
