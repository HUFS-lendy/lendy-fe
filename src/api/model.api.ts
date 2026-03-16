import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ModelsResponse } from "../type/model.type";

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
