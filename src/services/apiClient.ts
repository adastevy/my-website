const API_BASE = 'http://localhost:8000';
const TOKEN_KEY = 'studypal_session';

interface StoredSession {
  accessToken: string;
  refreshToken: string;
}

let accessToken: string | null = null;
let refreshToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setTokens(access: string, refresh: string): void {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ accessToken: access, refreshToken: refresh }),
  );
}

export function clearTokens(): void {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem(TOKEN_KEY);
}

export function loadTokens(): StoredSession | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed: StoredSession = JSON.parse(raw);
    accessToken = parsed.accessToken;
    refreshToken = parsed.refreshToken;
    return parsed;
  } catch {
    return null;
  }
}

async function doRefresh(): Promise<void> {
  if (!refreshToken) throw new Error('No refresh token');
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    throw new Error('Refresh failed');
  }
  const data = await res.json();
  accessToken = data.access_token;
  // Update stored session
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ accessToken: data.access_token, refreshToken }),
  );
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Auto-refresh on 401 (expired access token)
  if (res.status === 401 && refreshToken) {
    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        refreshPromise = null;
      });
    }
    try {
      await refreshPromise;
      headers['Authorization'] = `Bearer ${accessToken}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    } catch {
      // refresh failed — clear and let caller handle
      clearTokens();
    }
  }

  return res;
}
