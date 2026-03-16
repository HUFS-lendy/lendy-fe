import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

export const usePasswordChange = () => {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      confirmPassword,
    }: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const password_change_res = await apiClient.post(
        "/api/users/me/password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
      );
      return password_change_res.data;
    },
  });
};

export type UserMe = {
  userId: number;
  username: string;
  studentId: string;
  role: string;
  state: string;
  email: string;
  phone: string;
};

type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

const fetchMe = async (): Promise<UserMe> => {
  const res = await apiClient.get<ApiResponse<UserMe>>("/api/users/me");
  return res.data.data;
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });
};

// 이메일 변경 훅
export const useEmailChangeRequest = () => {
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newEmail,
    }: {
      currentPassword: string;
      newEmail: string;
    }) => {
      const res = await apiClient.post("/api/users/me/email/requests", {
        currentPassword,
        newEmail,
      });
      return res.data;
    },
  });
};

export const useEmailVerify = () => {
  return useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      const res = await apiClient.post("/api/users/me/email/verify", {
        code,
      });
      return res.data;
    },
  });
};