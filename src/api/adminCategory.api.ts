import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

export type CategoryItem = {
  category_id: number;
  name: string;
  description: string;
};

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

// 전체 카테고리 조회 - 관리자
const fetchCategories = async (): Promise<CategoryItem[]> => {
  const categories_res = await apiClient.get("/api/admin/categories");
  return categories_res.data.data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
