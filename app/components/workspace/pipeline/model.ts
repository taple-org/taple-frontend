import {
  TenantLeadStage,
  type PipelineCardItem,
  type StageColumn,
  type TaskBadge,
  type TenantMemberBrief,
} from "~/api/generated/api";

type Translate = (key: string, params?: Record<string, unknown>) => string;

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

const PIPELINE_STAGE_KEYS: Record<TenantLeadStage, string> = {
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

export function getPipelineStageLabel(stage: TenantLeadStage, t: Translate) {
  return t(PIPELINE_STAGE_KEYS[stage]);
}

export function getPipelineStageOptions(t: Translate) {
  return PIPELINE_STAGE_ORDER.map((stage) => ({
    value: stage,
    label: getPipelineStageLabel(stage, t),
  }));
}

export const PIPELINE_VISIBLE_STAGE_ORDER: TenantLeadStage[] = [
  TenantLeadStage.InProgress,
  TenantLeadStage.FirstContact,
  TenantLeadStage.Negotiation,
  TenantLeadStage.Contract,
];

export function getPipelineActionSections(t: Translate): PipelineBoardActionSection[] {
  return [
    {
      id: "next",
      title: t("pipeline.actions.moveTitle"),
      description: t("pipeline.actions.moveDescription"),
      actions: [
        { id: TenantLeadStage.Monitoring, label: t("leads.monitoring"), tone: "default" },
        { id: TenantLeadStage.Snoozed, label: t("leads.postpone"), tone: "warning" },
        { id: TenantLeadStage.Hidden, label: t("leads.hide"), tone: "default" },
        { id: TenantLeadStage.Lost, label: t("leads.lost"), tone: "danger" },
      ],
    },
  ];
}

export function normalizePipelineColumns(columns: StageColumn[]) {
  const mapped = new Map(columns.map((column) => [column.stage_code, column]));

  return PIPELINE_VISIBLE_STAGE_ORDER.map((stage) => {
    const existing = mapped.get(stage);
    if (existing) return existing;

    return {
      stage_code: stage,
      stage_name_en: stage,
      stage_name_ru: stage,
      total_count: 0,
      cards: [],
    };
  });
}

export function formatPipelineDate(
  value: string | null | undefined,
  locale: string,
) {
  if (!value) return "";

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

export function getTaskBadgeItems(
  taskBadge: TaskBadge | null | undefined,
  t: Translate,
) {
  if (!taskBadge?.total) {
    return [{ label: t("tasks.noTasks"), tone: "neutral" as PipelineTaskBadgeTone }];
  }

  const items = [
    {
      label: t("tasks.taskCountShort", { count: taskBadge.total }),
      tone: "primary" as PipelineTaskBadgeTone,
    },
  ];

  if (taskBadge.open) {
    items.push({
      label: t("tasks.openCountShort", { count: taskBadge.open }),
      tone: "warning" as PipelineTaskBadgeTone,
    });
  }
  if (taskBadge.overdue) {
    items.push({
      label: t("tasks.overdueCountShort", { count: taskBadge.overdue }),
      tone: "error" as PipelineTaskBadgeTone,
    });
  }
  if (taskBadge.completed) {
    items.push({
      label: t("tasks.completedCountShort", { count: taskBadge.completed }),
      tone: "success" as PipelineTaskBadgeTone,
    });
  }

  return items;
}

export function getPipelineCardTone(card: PipelineCardItem) {
  if (card.task_badge?.overdue) return "danger";
  if (card.task_badge?.open) return "warning";
  if (card.stage_code === TenantLeadStage.Won) return "success";
  return "default";
}
