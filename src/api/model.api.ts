import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ModelItem, ModelsResponse } from "../type/model.type";

// 전체 모델 조회
const fetchModels = async (): Promise<ModelItem[]> => {
  const res = await apiClient.get<ModelsResponse>("/api/models");
  return res.data.data;
};

export const useModels = () => {
  return useQuery<ModelItem[]>({ queryKey: ["models"], queryFn: fetchModels });
};
