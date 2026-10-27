import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ADMIN_UNAUTHORIZED_EVENT, loginAdmin } from "../api/adminClient";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const TOKEN_STORAGE_KEY = "adminToken";
const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

function getStoredToken(): string | null {
  const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  return token?.trim() ? token : null;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(getStoredToken);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginAdmin(email, password);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
    setToken(result.token);
  }, []);

  useEffect(() => {
    window.addEventListener(ADMIN_UNAUTHORIZED_EVENT, logout);
    return () => {
      window.removeEventListener(ADMIN_UNAUTHORIZED_EVENT, logout);
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: token !== null,
      login,
      logout,
    }),
    [login, logout, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
