import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { UserMe, ApiResponse } from "../type/user.type";

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

// 내 정보 조회
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

// 이메일 변경 인증 코드 요청
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

// 이메일 변경 인증 및 적용
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
