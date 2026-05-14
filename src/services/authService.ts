import { apiFetch, setTokens, clearTokens } from './apiClient';
import type { User } from '../mock/auth';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
}

interface RefreshRequest {
  refresh_token: string;
}

interface RefreshResponse {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
}

class AuthServiceError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = '请求失败';
    try {
      const body = await res.json();
      if (Array.isArray(body.detail)) {
        detail = body.detail
          .map((e: { msg?: string; loc?: string[] }) =>
            e.loc ? `${e.loc.join('.')}: ${e.msg}` : e.msg || '验证失败',
          )
          .join('; ');
      } else if (body.detail) {
        detail = body.detail;
      }
    } catch {
      // use default
    }
    throw new AuthServiceError(res.status, detail);
  }
  return res.json();
}

export async function register(
  req: RegisterRequest,
): Promise<RegisterResponse> {
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  return handleResponse<RegisterResponse>(res);
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  const data = await handleResponse<LoginResponse>(res);
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function refresh(
  req: RefreshRequest,
): Promise<RefreshResponse> {
  const res = await apiFetch('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify(req),
  });
  return handleResponse<RefreshResponse>(res);
}

export async function getMe(): Promise<User> {
  const res = await apiFetch('/api/users/me');
  if (!res.ok) {
    clearTokens();
    let detail = 'Not authenticated';
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // use default
    }
    throw new AuthServiceError(res.status, detail);
  }
  return res.json();
}

export { AuthServiceError };
export type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
};
