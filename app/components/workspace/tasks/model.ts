import {
  ReschedulePreset,
  TaskBucket,
  TenantLeadTaskType,
  type CompleteTaskRequest,
  type CreateGlobalTaskRequest,
  type RescheduleTaskRequest,
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

export type TaskCreatePayload = Omit<CreateGlobalTaskRequest, "assigned_to_member_id">;

export type TaskUpdatePayload = Pick<
  UpdateTaskRequest,
  "title" | "description" | "task_type" | "due_at" | "result"
>;

export type TaskCompletePayload = CompleteTaskRequest;

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

export const TASK_TYPE_OPTIONS = Object.values(TenantLeadTaskType).map((value) => ({
  value,
  label: TASK_TYPE_LABELS[value],
}));

export const TASK_ACTION_SECTIONS: TaskBoardActionSection[] = [
  {
    id: "status",
    title: "Статус",
    description: "Быстрые действия над задачей",
    actions: [
      { id: "delete", label: "Удалить", tone: "danger" },
      { id: "done", label: "Done", tone: "success" },
    ],
  },
  {
    id: "reschedule",
    title: "Reschedule",
    description: "Быстрый перенос срока",
    actions: [
      { id: "reschedule_tomorrow", label: "На завтра", tone: "default" },
      { id: "reschedule_in_two_days", label: "Послезавтра", tone: "default" },
      { id: "reschedule_next_week", label: "На след. неделю", tone: "warning" },
    ],
  },
];

export function formatTaskDueAt(value?: string | null) {
  if (!value) return "Без дедлайна";

  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toDatePart(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function toTimePart(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function fromDateAndTime(datePart: string, timePart: string) {
  if (!datePart) return null;

  const normalizedTime = timePart || "10:00";
  return new Date(`${datePart}T${normalizedTime}:00`).toISOString();
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

export function buildMovePayloadForBucket(bucket: TaskBucket): RescheduleTaskRequest | CompleteTaskRequest | null {
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

export function buildActionPayload(actionId: TaskBoardActionId): RescheduleTaskRequest | CompleteTaskRequest | null {
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

function buildDateAtHour(daysToAdd: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(hour, 0, 0, 0);
  return date;
}

function buildNextMondayAtHour(hour: number) {
  const date = new Date();
  const day = date.getDay();
  const daysUntilNextMonday = ((8 - day) % 7) || 7;
  date.setDate(date.getDate() + daysUntilNextMonday);
  date.setHours(hour, 0, 0, 0);
  return date;
}
