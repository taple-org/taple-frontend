import type { SelectOption } from "~/components/ui/fields/registry";

function getMemberLabel(firstName?: string | null, lastName?: string | null, email?: string | null) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return fullName || email || "Без имени";
}

export function useWorkspaceMemberOptions(workspaceId: MaybeRefOrGetter<string>) {
  const resolvedWorkspaceId = computed(() => toValue(workspaceId));

  const asyncData = useAsyncData(
    computed(() => `workspace-members-${resolvedWorkspaceId.value}`),
    (nuxtApp) =>
      nuxtApp.$apiClient.api
        .listMembersApiV1TenantsTenantIdMembersGet(resolvedWorkspaceId.value)
        .then((response) =>
          response.data.result.map(
            (member): SelectOption => ({
              value: member.id,
              label: getMemberLabel(member.first_name, member.last_name, member.email),
            }),
          ),
        ),
    {
      server: false,
      default: () => [],
      watch: [resolvedWorkspaceId],
    },
  );

  const options = computed<SelectOption[]>(() => [
    { value: "", label: "Не назначено" },
    ...((asyncData.data.value ?? []) as SelectOption[]),
  ]);

  return {
    ...asyncData,
    options,
  };
}
