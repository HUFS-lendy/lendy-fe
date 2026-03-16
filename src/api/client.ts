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

// accessToken 자동 주입
apiClient.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isAuthEndpoint =
    url.includes("/api/auth/login") || url.includes("/api/auth/refresh");

  if (!isAuthEndpoint) {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  console.log("REQUEST URL:", config.url);
  console.log("AUTH HEADER:", config.headers?.Authorization);

  return config;
});

// 동시에 여러 요청이 401 터질 때 refresh 중복 호출 방지
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

    const originalRequest = error.config as RetriableRequestConfig;

    // 401만 처리
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // login / refresh 자체가 실패한 경우에는 refresh 재시도하지 않음
    if(
      originalRequest?.url?.includes("/api/auth/login") ||
      originalRequest?.url?.includes("/api/auth/refresh")
    ){
      return Promise.reject(error);
    }

    // 무한 루프 방지
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // 이미 refresh 중이면 큐에서 대기 후 재시도
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (newToken) => {
            // 새 토큰으로 헤더 갱신 후 재시도
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
        await apiClient.post<ApiResponse<AccessTokenResponse>>("/api/auth/refresh");

      const { accessToken } = refreshRes.data.data;

      // zustand store 갱신
      useAuthStore.getState().setAuth({
        isAuthenticated: true,
        accessToken,
        tokenType: "Bearer",
      });

      runQueue(null, accessToken);

      // 원래 요청도 새 토큰으로 재시도
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
