import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/authStore";

const baseUrl = "https://lendy-api.hufs.ac.kr";

export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

type AccessTokenResponse = {
  accessToken: string;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isAuthEndpoint =
    url.includes("/api/auth/login") || url.includes("/api/auth/refresh");

  if (!isAuthEndpoint) {
    const { accessToken, tokenType } = useAuthStore.getState();

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `${tokenType ?? "Bearer"} ${accessToken}`;
    }
  }

  return config;
});

let isRefreshing = false;

type RefreshQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let refreshQueue: RefreshQueueItem[] = [];

const runQueue = (error: unknown | null, newAccessToken?: string) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newAccessToken ?? "");
  });

  refreshQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.response) return Promise.reject(error);

    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (!originalRequest) return Promise.reject(error);

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";
    const isAuthEndpoint =
      url.includes("/api/auth/login") || url.includes("/api/auth/refresh");

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (newToken) => {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshRes =
        await apiClient.post<ApiResponse<AccessTokenResponse>>(
          "/api/auth/refresh",
        );

      const accessToken = refreshRes.data.data?.accessToken;

      if (!accessToken) {
        throw new Error("토큰 재발급 실패");
      }

      useAuthStore.getState().setAuth({
        accessToken,
        tokenType: "Bearer",
      });

      runQueue(null, accessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError: unknown) {
      runQueue(refreshError);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
