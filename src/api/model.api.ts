import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

export interface ModelItem {
  modelId: number;
  categoryId: number;
  categoryName: string;
  type: string;
  name: string;
  courseName: string;
  availableQty: number;
}

interface ModelsResponse {
  success: boolean;
  code: string;
  message: string;
  data: ModelItem[];
}

// 전체 모델 조회
const fetchModels = async (): Promise<ModelsResponse> => {
  const models_res = await apiClient.get("/api/models");
  return models_res.data;
};

export const useModels = () => {
  return useQuery({
    queryKey: ["models"],
    queryFn: fetchModels,
  });
};
