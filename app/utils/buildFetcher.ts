import auth from "~/configs/api.config";


export default function buildFetcher(
  url: URL | RequestInfo,
  options?: RequestInit,
) {
  const token = import.meta.client ? localStorage.getItem(auth.token) : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZWZkZGM4My1jMzU0LTRhYWQtYjY2OS1iODI5ZDYwN2I3NWQiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzc1MTUzNzE0LCJleHAiOjE3NzUxNTU1MTR9.C1sweBE9xrUjjNFeFOhxYcJpLkE1biDOrtod6EwB8fc";
  return fetch(url.toString(), {
    ...options,
    headers: {
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });
}
