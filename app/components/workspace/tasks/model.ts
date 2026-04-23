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

export const TASK_TYPE_LABELS: Record<TenantLeadTaskType, string> = {
  [TenantLeadTaskType.FollowUp]: "Follow-up",
  [TenantLeadTaskType.MakeFirstContact]: "Первый контакт",
  [TenantLeadTaskType.VisitBranch]: "Визит",
  [TenantLeadTaskType.MakeNegotiation]: "Переговоры",
  [TenantLeadTaskType.Contract]: "Контракт",
  [TenantLeadTaskType.MonitorLead]: "Мониторинг",
  [TenantLeadTaskType.WinLead]: "Успешно",
  [TenantLeadTaskType.LoseLead]: "Потерян",
  [TenantLeadTaskType.HideLead]: "Скрыт",
  [TenantLeadTaskType.Other]: "Другое",
};

export const TASK_TYPE_OPTIONS = Object.values(TenantLeadTaskType).map(
  (value) => ({
    value,
    label: TASK_TYPE_LABELS[value],
  }),
);

export const TASK_ACTION_SECTIONS: TaskBoardActionSection[] = [
  {
    id: "status",
    title: "Статус",
    description: "Быстрые действия над задачей",
    actions: [
      { id: "delete", label: "Удалить", tone: "danger" },
      { id: "done", label: "Завершить", tone: "success" },
    ],
  },
  {
    id: "reschedule",
    title: "Перенос",
    description: "Быстрый перенос срока",
    actions: [
      { id: "reschedule_tomorrow", label: "На завтра", tone: "default" },
      { id: "reschedule_in_two_days", label: "Послезавтра", tone: "default" },
      { id: "reschedule_next_week", label: "На след. неделю", tone: "warning" },
    ],
  },
];

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

export const TASK_BOARD_GROUPS: TaskBoardGroup[] = [
  {
    id: "urgent",
    title: "Срочно",
    description: "Просроченные задачи и задачи на сегодня.",
    buckets: [TaskBucket.Overdue, TaskBucket.Today],
  },
  {
    id: "upcoming",
    title: "Ближайшие",
    description: "Ближайшие задачи на следующие несколько дней.",
    buckets: [TaskBucket.Tomorrow, TaskBucket.InTwoDays, TaskBucket.NextMonday],
  },
  {
    id: "later",
    title: "Позже",
    description: "Можно вернуться позже без срочного дедлайна.",
    buckets: [TaskBucket.Later],
  },
  {
    id: "done",
    title: "Завершено",
    description: "Уже выполненные задачи.",
    buckets: [TaskBucket.Done],
  },
];

export const TASK_BUCKET_LABELS: Record<
  TaskBucket,
  { en: string; ru: string }
> = {
  [TaskBucket.Overdue]: { en: "Overdue", ru: "Просрочено" },
  [TaskBucket.Today]: { en: "Today", ru: "Сегодня" },
  [TaskBucket.Tomorrow]: { en: "Tomorrow", ru: "Завтра" },
  [TaskBucket.InTwoDays]: { en: "In Two Days", ru: "Послезавтра" },
  [TaskBucket.NextMonday]: { en: "Next Monday", ru: "Следующий понедельник" },
  [TaskBucket.Later]: { en: "Later", ru: "Позже" },
  [TaskBucket.Done]: { en: "Done", ru: "Выполнено" },
};

export const TASK_BUCKET_OPTIONS = TASK_BUCKET_ORDER.map((bucket) => ({
  value: bucket,
  label: TASK_BUCKET_LABELS[bucket].ru,
}));

export function formatTaskDueAt(value?: string | null) {
  if (!value) return "Без дедлайна";

  return new Date(value).toLocaleString("ru-RU", {
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

export function getTaskTypeLabel(taskType: TenantLeadTaskType) {
  return TASK_TYPE_LABELS[taskType];
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
      label_en: TASK_BUCKET_LABELS[bucket].en,
      label_ru: TASK_BUCKET_LABELS[bucket].ru,
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
