import { toRaw } from "vue";
import type { CollectedScopes } from "~/composables/workspace/useWorkspaceFormScope";

export function normalizeWorkspaceForm(value: CollectedScopes) {
  const raw = toRaw(value);
  return {
    name: raw.naming.name,
    district: raw.naming.district,
    queue: raw.queuing.queue.map((q) => ({ id: q.id, label: q.label })),
    trades: raw.taging.trades.map((t) => ({
      id: t.id,
      label: t.label,
      tags: t.tags.map((tag) => ({ id: tag.id, label: tag.label })),
    })),
  };
}
