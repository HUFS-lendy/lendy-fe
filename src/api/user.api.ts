import { useMutation } from "@tanstack/react-query";
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
