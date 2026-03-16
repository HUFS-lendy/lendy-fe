import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TokenType = "Bearer" | string;

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  tokenType?: TokenType;
}

export interface AuthActions {
  setAuth: (payload: Partial<AuthState> & { isAuthenticated: boolean }) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      tokenType: "Bearer",

      setAuth: (payload) =>
        set((prev) => ({
          ...prev,
          ...payload,
        })),

      logout: () =>
        set({
          isAuthenticated: false,
          accessToken: null,
          tokenType: "Bearer",
        }),
    }),
    {
      name: "authState",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
