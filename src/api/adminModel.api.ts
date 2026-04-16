import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

// 모델 등록
export const useCreateModel = () => {
  return useMutation({
    mutationFn: async ({
      categoryName,
      type,
      name,
      courseName,
      totalQty,
      serials,
      qtyAndSerialsSizeMatching,
    }: {
      categoryName: string;
      type: string;
      name: string;
      courseName: string;
      totalQty: number;
      serials: string[];
      qtyAndSerialsSizeMatching: boolean;
    }) => {
      const create_model_res = await apiClient.post("/api/admin/models", {
        categoryName,
        type,
        name,
        courseName,
        totalQty,
        serials,
        qtyAndSerialsSizeMatching,
      });
      return create_model_res.data;
    },
  });
};

// 전체 모델 조회 - 관리자
const fetchModels = async () => {
  const models_res = await apiClient.get("/api/admin/models");
  return models_res.data.data;
};

export const useModels = () => {
  return useQuery({
    queryKey: ["models"],
    queryFn: fetchModels,
  });
};

// 모델 삭제
export const useDeleteModel = () => {
  return useMutation({
    mutationFn: async (modelId: number) => {
      const delete_model_res = await apiClient.delete(
        `/api/admin/models/${modelId}`,
      );
      return delete_model_res.data;
    },
  });
};
