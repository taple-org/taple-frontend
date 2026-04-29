import { TokenKey, RefreshTokenKey } from "~/constants/api.constants";

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function subscribeToRefresh(cb: (token: string | null) => void) {
  refreshQueue.push(cb);
}

function notifyRefreshQueue(token: string | null) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

function getCookieValue(cookieHeader: string | null | undefined, key: string) {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function setBrowserCookie(key: string, value: string | null) {
  if (!import.meta.client) return;

  const expires = value
    ? `; Max-Age=${60 * 60 * 24 * 30}`
    : "; Max-Age=0";
  document.cookie = `${key}=${value ? encodeURIComponent(value) : ""}; Path=/; SameSite=Lax${expires}`;
}

function clearBrowserAuth() {
  if (!import.meta.client) return;

  localStorage.removeItem(TokenKey);
  localStorage.removeItem(RefreshTokenKey);
  setBrowserCookie(TokenKey, null);
  setBrowserCookie(RefreshTokenKey, null);
}

async function tryRefreshToken(baseUrl: string, backendKey: string): Promise<string | null> {
  const refreshToken = localStorage.getItem(RefreshTokenKey);
  if (!refreshToken) return null;

  const res = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Backend-Key": backendKey,
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const newAccessToken: string | undefined = data?.result?.access_token;
  const newRefreshToken: string | undefined = data?.result?.refresh_token;

  if (!newAccessToken) return null;

  localStorage.setItem(TokenKey, newAccessToken);
  if (newRefreshToken) localStorage.setItem(RefreshTokenKey, newRefreshToken);
  setBrowserCookie(TokenKey, newAccessToken);
  if (newRefreshToken) {
    setBrowserCookie(RefreshTokenKey, newRefreshToken);
  }

  return newAccessToken;
}

export default function buildFetcher(
  baseUrl: string,
  backendKey: string,
  serverCookieHeader?: string,
) {
  return async (url: URL | RequestInfo, options?: RequestInit): Promise<Response> => {
    const token = import.meta.client
      ? (localStorage.getItem(TokenKey) || getCookieValue(document.cookie, TokenKey))
      : getCookieValue(serverCookieHeader, TokenKey);

    const doFetch = (accessToken: string | null) =>
        fetch(url.toString(), {
          ...options,
          headers: {
            Accept: "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            "X-Backend-Key": backendKey,
            ...options?.headers,
          },
        });

    const response = await doFetch(token);

    if (response.status !== 401 || !import.meta.client) {
      return response;
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeToRefresh(async (newToken) => {
          resolve(await doFetch(newToken));
        });
      });
    }

    isRefreshing = true;

    const newToken = await tryRefreshToken(baseUrl, backendKey).catch(() => null);

    isRefreshing = false;
    notifyRefreshQueue(newToken);

    if (!newToken) {
      clearBrowserAuth();
      window.location.href = "/";
      return response;
    }

    return doFetch(newToken);
  };
}
