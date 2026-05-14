import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  getMe,
  AuthServiceError,
  type LoginRequest,
  type RegisterRequest,
} from '../services/authService';
import { type User } from '../mock/auth';
import { loadTokens, clearTokens } from '../services/apiClient';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | {
      type: 'LOGIN_SUCCESS';
      payload: {
        user: User;
        accessToken: string;
        refreshToken: string;
      };
    }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESHED'; payload: { accessToken: string } }
  | { type: 'RESTORE_SESSION'; payload: { user: User; accessToken: string; refreshToken: string } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'TOKEN_REFRESHED':
      return {
        ...state,
        accessToken: action.payload.accessToken,
      };
    case 'RESTORE_SESSION':
      return {
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
};

interface AuthActions {
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const session = loadTokens();
    if (!session?.accessToken) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    getMe()
      .then((user) => {
        dispatch({
          type: 'RESTORE_SESSION',
          payload: {
            user,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
          },
        });
      })
      .catch(() => {
        clearTokens();
        dispatch({ type: 'SET_LOADING', payload: false });
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const req: LoginRequest = { username, password };
    const res = await apiLogin(req);
    const user = await getMe();
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        user,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
      },
    });
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const req: RegisterRequest = { username, email, password };
      await apiRegister(req);
      const loginRes = await apiLogin({ username, password });
      const user = await getMe();
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user,
          accessToken: loginRes.access_token,
          refreshToken: loginRes.refresh_token,
        },
      });
    },
    [],
  );

  const logout = useCallback(() => {
    clearTokens();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const refreshAccessToken = useCallback(async () => {
    // Handled automatically by apiClient on 401
    throw new AuthServiceError(500, 'Not implemented — use apiClient auto-refresh');
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
