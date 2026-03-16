import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./client";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({
      studentId,
      username,
      password,
      email,
      phone,
    }: {
      studentId: string;
      username: string;
      password: string;
      email: string;
      phone: string;
    }) => {
      const sign_up_res = await apiClient.post("/api/auth/signup", {
        studentId,
        username,
        password,
        email,
        phone,
      });
      return sign_up_res.data;
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