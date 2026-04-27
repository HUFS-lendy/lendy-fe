import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TokenType = "Bearer" | string;

export interface AuthState {
  accessToken: string | null;
  tokenType: TokenType;
}

export interface AuthActions {
  setAuth: (payload: { accessToken: string; tokenType?: TokenType }) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      tokenType: "Bearer",

      setAuth: (payload) =>
        set({
          accessToken: payload.accessToken,
          tokenType: payload.tokenType ?? "Bearer",
        }),

      logout: () =>
        set({
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
