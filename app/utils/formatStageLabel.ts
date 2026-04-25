const STAGE_LABELS_RU: Record<string, string> = {
  new: "Новые",
  snoozed: "Отложенные",
  in_progress: "В работе",
  first_contact: "Первый контакт",
  negotiation: "Переговоры",
  contract: "Контракт",
  monitoring: "Мониторинг",
  won: "Успешно",
  lost: "Потеряно",
  hidden: "Скрыто",
  qualified: "Квалифицирован",
  proposal: "Предложение",
};

function normalizeStageCode(stage: string): string {
  return stage.trim().toLowerCase();
}

function prettifyStageCode(stage: string): string {
  const normalized = normalizeStageCode(stage);
  if (!normalized) return stage;

  const withSpaces = normalized.replaceAll("_", " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export function formatStageLabel(stage: string, label?: string | null): string {
  const normalized = normalizeStageCode(stage);
  if (!normalized) return label?.trim() || stage;

  const mapped = STAGE_LABELS_RU[normalized];
  if (mapped) return mapped;

  const trimmedLabel = label?.trim();
  if (trimmedLabel && trimmedLabel.toLowerCase() !== normalized) return trimmedLabel;

  return prettifyStageCode(normalized);
}
