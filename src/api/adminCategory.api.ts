import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./client";

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => {
      const create_category_res = await apiClient.post(
        "/api/admin/categories",
        {
          name,
          description,
        },
      );
      return create_category_res.data;
    },
  });
};
