export type LocalizedRecord = Record<string, unknown>;

export function resolveApiLocale(locale: string) {
  return locale === "en" ? "en" : "ru";
}

export function getLocalizedField(
  record: LocalizedRecord | null | undefined,
  keyBase: string,
  locale: string,
) {
  if (!record) return "";

  const apiLocale = resolveApiLocale(locale);
  const keys =
    apiLocale === "en"
      ? [`${keyBase}_en`, `${keyBase}_ru`, keyBase]
      : [`${keyBase}_ru`, `${keyBase}_en`, keyBase];

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}
