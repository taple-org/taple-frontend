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

  return newAccessToken;
}

export default function buildFetcher(baseUrl: string, backendKey: string) {
  return async (url: URL | RequestInfo, options?: RequestInit): Promise<Response> => {
    const token = import.meta.client ? localStorage.getItem(TokenKey) : null;

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
      const authStore = useAuthStore();
      authStore.clearAuth();
      const router = useRouter();
      await router.push('/login');
      return response;
    }

    return doFetch(newToken);
  };
}