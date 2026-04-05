import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { CategoryItem } from "../type/adminCategory.type";

// 카테고리 생성
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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

// 카테고리 삭제
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: number) => {
      const delete_category_res = await apiClient.delete(
        `/api/admin/categories/${categoryId}`,
      );
      return delete_category_res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// 카테고리 정보 수정
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category_id, name, description }: CategoryItem) => {
      const updateCategory_res = await apiClient.patch(
        `/api/admin/categories/${category_id}`,
        {
          name,
          description,
        },
      );

      return updateCategory_res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
