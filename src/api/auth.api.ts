import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { apiClient } from "./client";

type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

type SignUpRequest = {
  studentId: string;
  username: string;
  password: string;
  email: string;
  phone: string;
};

type SignUpData = {
  userId?: number;
  username?: string;
  studentId?: string;
  email?: string;
  phone?: string;
};

const getAuthApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError<ApiResponse<null>>(error))
    return error.response?.data?.message ?? fallbackMessage;
  if (error instanceof Error) return error.message;
  return fallbackMessage;
};

const checkApiSuccess = <T>(
  response: ApiResponse<T>,
  fallbackMessage: string,
) => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response;
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({
      studentId,
      username,
      password,
      email,
      phone,
    }: SignUpRequest): Promise<ApiResponse<SignUpData | null>> => {
      try {
        const res = await apiClient.post<ApiResponse<SignUpData | null>>(
          "/api/auth/signup",
          { studentId, username, password, email, phone },
        );
        return checkApiSuccess(res.data, "회원가입 중 오류가 발생했습니다.");
      } catch (error) {
        throw new Error(
          getAuthApiErrorMessage(error, "회원가입 중 오류가 발생했습니다."),
        );
      }
    },
  });
};

export const usePasswordResetRequest = () => {
  return useMutation({
    mutationFn: async ({
      studentId,
      email,
    }: {
      studentId: string;
      email: string;
    }) => {
      const res = await apiClient.post("/api/auth/password-reset/request", {
        studentId,
        email,
      });
      return res.data;
    },
  });
};

export const usePasswordResetConfirm = () => {
  return useMutation({
    mutationFn: async ({
      studentId,
      email,
      code,
      newPassword,
      confirmPassword,
    }: {
      studentId: string;
      email: string;
      code: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const res = await apiClient.post("/api/auth/password-reset/confirm", {
        studentId,
        email,
        code,
        newPassword,
        confirmPassword,
      });
      return res.data;
    },
  });
};
