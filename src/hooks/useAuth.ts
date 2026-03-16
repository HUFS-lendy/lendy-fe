import { useCallback } from "react";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/react/shallow";

type LoginParams = { id: string; password: string };

type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

type AccessTokenResponse = { accessToken: string };

type AxiosLikeError = {
  response?: { data?: { message?: string } };
};

const isTokenValid = (token: unknown): token is string =>
  typeof token === "string" && token.length > 0;

const useAuth = () => {
  const auth = useAuthStore(
    useShallow((s) => ({
      isAuthenticated: s.isAuthenticated,
      accessToken: s.accessToken,
      tokenType: s.tokenType,
    })),
  );

  const setAuth = useAuthStore((s) => s.setAuth);
  const logoutStore = useAuthStore((s) => s.logout);

  const loggedIn = auth.isAuthenticated;

  const login = useCallback(
    async ({ id, password }: LoginParams): Promise<{ message?: string }> => {
      try {
        const response = await apiClient.post<ApiResponse<AccessTokenResponse>>(
          "/api/auth/login",
          { studentId: id, password },
        );

        const { accessToken } = response.data.data;

        if (!isTokenValid(accessToken)) {
          throw new Error("유효하지 않은 토큰");
        }

        setAuth({
          isAuthenticated: true,
          accessToken,
          tokenType: "Bearer",
        });

        return { message: response.data.message };
      } catch (e) {
        const error = e as AxiosLikeError;
        const msg = error.response?.data?.message || "로그인에 실패했습니다.";
        throw new Error(msg);
      }
    },
    [setAuth],
  );

  const logout = useCallback(async (): Promise<{ message?: string }> => {
    try {
      await apiClient.post("/api/auth/logout");

      logoutStore();
      return { message: "로그아웃 되었습니다." };
    } catch (e) {
      logoutStore();

      const error = e as AxiosLikeError;
      const msg = error.response?.data?.message || "로그아웃 되었습니다.";
      return { message: msg };
    }
  }, [logoutStore]);

  return { ...auth, loggedIn, login, logout };
};

export default useAuth;
