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
