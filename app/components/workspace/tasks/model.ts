import {
  ReschedulePreset,
  TaskBucket,
  TenantLeadTaskType,
  type CompleteTaskRequest,
  type CreateGlobalTaskRequest,
  type RescheduleTaskRequest,
  type TaskBoardColumn,
  type TaskBoardItem,
  type UpdateTaskRequest,
} from "~/api/generated/api";

type Translate = (key: string, params?: Record<string, unknown>) => string;

export type TaskBoardActionId =
  | "delete"
  | "reschedule_tomorrow"
  | "reschedule_in_two_days"
  | "reschedule_next_week"
  | "done";

export type TaskBoardActionSection = {
  id: string;
  title: string;
  description: string;
  actions: Array<{
    id: TaskBoardActionId;
    label: string;
    tone: "default" | "warning" | "success" | "danger";
  }>;
};

export type TaskCreatePayload = CreateGlobalTaskRequest;

export type TaskUpdatePayload = Pick<
  UpdateTaskRequest,
  | "title"
  | "description"
  | "task_type"
  | "due_at"
  | "result"
  | "assigned_to_member_id"
>;

export type TaskCompletePayload = CompleteTaskRequest;

export type TaskBoardGroup = {
  id: "urgent" | "upcoming" | "later" | "done";
  title: string;
  description: string;
  buckets: TaskBucket[];
};

const TASK_TYPE_KEYS: Record<TenantLeadTaskType, string> = {
  [TenantLeadTaskType.FollowUp]: "tasks.types.followUp",
  [TenantLeadTaskType.MakeFirstContact]: "tasks.types.makeFirstContact",
  [TenantLeadTaskType.VisitBranch]: "tasks.types.visitBranch",
  [TenantLeadTaskType.MakeNegotiation]: "tasks.types.makeNegotiation",
  [TenantLeadTaskType.Contract]: "tasks.types.contract",
  [TenantLeadTaskType.MonitorLead]: "tasks.types.monitorLead",
  [TenantLeadTaskType.WinLead]: "tasks.types.winLead",
  [TenantLeadTaskType.LoseLead]: "tasks.types.loseLead",
  [TenantLeadTaskType.HideLead]: "tasks.types.hideLead",
  [TenantLeadTaskType.Other]: "tasks.types.other",
};

export function getTaskTypeLabel(taskType: TenantLeadTaskType, t: Translate) {
  return t(TASK_TYPE_KEYS[taskType]);
}

export function getTaskTypeOptions(t: Translate) {
  return Object.values(TenantLeadTaskType).map((value) => ({
    value,
    label: getTaskTypeLabel(value, t),
  }));
}

export function getTaskActionSections(t: Translate): TaskBoardActionSection[] {
  return [
    {
      id: "status",
      title: t("tasks.actions.statusTitle"),
      description: t("tasks.actions.statusDescription"),
      actions: [
        { id: "delete", label: t("common.delete"), tone: "danger" },
        { id: "done", label: t("tasks.completeTask"), tone: "success" },
      ],
    },
    {
      id: "reschedule",
      title: t("tasks.actions.rescheduleTitle"),
      description: t("tasks.actions.rescheduleDescription"),
      actions: [
        { id: "reschedule_tomorrow", label: t("tasks.actions.tomorrow"), tone: "default" },
        { id: "reschedule_in_two_days", label: t("tasks.actions.inTwoDays"), tone: "default" },
        { id: "reschedule_next_week", label: t("tasks.actions.nextWeek"), tone: "warning" },
      ],
    },
  ];
}

export const TASK_BUCKET_ORDER: TaskBucket[] = [
  TaskBucket.Overdue,
  TaskBucket.Today,
  TaskBucket.Tomorrow,
  TaskBucket.InTwoDays,
  TaskBucket.NextMonday,
  TaskBucket.Later,
  TaskBucket.Done,
];

export const DEFAULT_TASK_BUCKETS: TaskBucket[] = [
  TaskBucket.Overdue,
  TaskBucket.Today,
  TaskBucket.Tomorrow,
];

export function getTaskBoardGroups(t: Translate): TaskBoardGroup[] {
  return [
    {
      id: "urgent",
      title: t("tasks.groups.urgentTitle"),
      description: t("tasks.groups.urgentDescription"),
      buckets: [TaskBucket.Overdue, TaskBucket.Today],
    },
    {
      id: "upcoming",
      title: t("tasks.groups.upcomingTitle"),
      description: t("tasks.groups.upcomingDescription"),
      buckets: [TaskBucket.Tomorrow, TaskBucket.InTwoDays, TaskBucket.NextMonday],
    },
    {
      id: "later",
      title: t("tasks.groups.laterTitle"),
      description: t("tasks.groups.laterDescription"),
      buckets: [TaskBucket.Later],
    },
    {
      id: "done",
      title: t("tasks.groups.doneTitle"),
      description: t("tasks.groups.doneDescription"),
      buckets: [TaskBucket.Done],
    },
  ];
}

const TASK_BUCKET_KEYS: Record<TaskBucket, string> = {
  [TaskBucket.Overdue]: "tasks.buckets.overdue",
  [TaskBucket.Today]: "tasks.buckets.today",
  [TaskBucket.Tomorrow]: "tasks.buckets.tomorrow",
  [TaskBucket.InTwoDays]: "tasks.buckets.inTwoDays",
  [TaskBucket.NextMonday]: "tasks.buckets.nextMonday",
  [TaskBucket.Later]: "tasks.buckets.later",
  [TaskBucket.Done]: "tasks.buckets.done",
};

export function getTaskBucketLabel(bucket: TaskBucket, t: Translate) {
  return t(TASK_BUCKET_KEYS[bucket]);
}

export function getTaskBucketOptions(t: Translate) {
  return TASK_BUCKET_ORDER.map((bucket) => ({
    value: bucket,
    label: getTaskBucketLabel(bucket, t),
  }));
}

export function formatTaskDueAt(
  value: string | null | undefined,
  locale: string,
  t: Translate,
) {
  if (!value) return t("tasks.noDeadline");

  return new Date(value).toLocaleString(locale, {
    day: "2-digit",
    month: "short",
  });
}

export function toDatePart(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function fromDateOnly(datePart: string) {
  if (!datePart) return null;

  return new Date(`${datePart}T12:00:00`).toISOString();
}

export function fromDateAndTime(datePart: string, timePart: string) {
  if (!datePart) return null;

  const time = timePart || "12:00";
  return new Date(`${datePart}T${time}:00`).toISOString();
}

export function getTaskTone(task: TaskBoardItem) {
  if (task.bucket === TaskBucket.Done) return "success";
  if (task.bucket === TaskBucket.Overdue) return "danger";
  if (task.bucket === TaskBucket.Today) return "warning";
  return "default";
}

export function buildMovePayloadForBucket(
  bucket: TaskBucket,
): RescheduleTaskRequest | CompleteTaskRequest | null {
  switch (bucket) {
    case TaskBucket.Overdue:
      return null;
    case TaskBucket.Today:
      return { due_at: buildDateAtHour(0, 18).toISOString() };
    case TaskBucket.Tomorrow:
      return { preset: ReschedulePreset.Tomorrow };
    case TaskBucket.InTwoDays:
      return { due_at: buildDateAtHour(2, 10).toISOString() };
    case TaskBucket.NextMonday:
      return { due_at: buildNextMondayAtHour(10).toISOString() };
    case TaskBucket.Later:
      return { preset: ReschedulePreset.In7Days };
    case TaskBucket.Done:
      return { result: null };
    default:
      return null;
  }
}

export function buildActionPayload(
  actionId: TaskBoardActionId,
): RescheduleTaskRequest | CompleteTaskRequest | null {
  switch (actionId) {
    case "delete":
      return null;
    case "done":
      return { result: null };
    case "reschedule_tomorrow":
      return { preset: ReschedulePreset.Tomorrow };
    case "reschedule_in_two_days":
      return { due_at: buildDateAtHour(2, 10).toISOString() };
    case "reschedule_next_week":
      return { preset: ReschedulePreset.In7Days };
    default:
      return null;
  }
}

export function normalizeTaskBoardColumns(columns: TaskBoardColumn[]) {
  const mapped = new Map(columns.map((column) => [column.bucket, column]));

  return TASK_BUCKET_ORDER.map((bucket) => {
    const existing = mapped.get(bucket);
    if (existing) return existing;

    return {
      bucket,
      label_en: bucket,
      label_ru: bucket,
      count: 0,
      tasks: [],
    };
  });
}

export function filterTaskBoardColumns(
  columns: TaskBoardColumn[],
  buckets: TaskBucket[],
) {
  if (!buckets.length) return [];

  const visibleBuckets = new Set(buckets);
  return normalizeTaskBoardColumns(columns).filter((column) =>
    visibleBuckets.has(column.bucket),
  );
}

function buildDateAtHour(daysToAdd: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function buildNextMondayAtHour(hour: number) {
  const date = new Date();
  const day = date.getDay();
  const daysUntilNextMonday = (8 - day) % 7 || 7;
  date.setDate(date.getDate() + daysUntilNextMonday);
  date.setHours(hour, 0, 0, 0);
  return date;
}
