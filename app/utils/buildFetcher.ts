import { TokenKey } from "~/constants/api.constants";

export default function buildFetcher(
  url: URL | RequestInfo,
  options?: RequestInit,
) {
  const token = import.meta.client ? localStorage.getItem(TokenKey) : null;
  return fetch(url.toString(), {
    ...options,
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
}
