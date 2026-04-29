import { getLocalizedField } from "./localized";

function normalizeStageCode(stage: string): string {
  return stage.trim().toLowerCase();
}

function prettifyStageCode(stage: string): string {
  const normalized = normalizeStageCode(stage);
  if (!normalized) return stage;

  const withSpaces = normalized.replaceAll("_", " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export function formatStageLabel(
  stage: string,
  labels: Record<string, unknown> | string | null | undefined,
  locale = "ru",
): string {
  const normalized = normalizeStageCode(stage);
  if (!normalized) {
    if (typeof labels === "string") return labels.trim() || stage;
    return getLocalizedField(labels, "label", locale) || stage;
  }

  if (typeof labels === "string") {
    const trimmedLabel = labels.trim();
    if (trimmedLabel && trimmedLabel.toLowerCase() !== normalized) {
      return trimmedLabel;
    }
  } else {
    const localizedLabel = getLocalizedField(labels, "label", locale);
    if (localizedLabel && localizedLabel.toLowerCase() !== normalized) {
      return localizedLabel;
    }
  }

  return prettifyStageCode(normalized);
}
