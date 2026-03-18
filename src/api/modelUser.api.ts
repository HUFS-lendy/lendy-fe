import { useQuery, useQueries } from "@tanstack/react-query";
import { apiClient } from "./client";

export const fetchModelById = async (modelId: number) => {
  const res = await apiClient.get(`/api/models/${modelId}`);
  return res.data.data;
};

export const useModelById = (modelId: number) => {
  return useQuery({
    queryKey: ["model-by-id", modelId],
    queryFn: () => fetchModelById(modelId),
    enabled: !!modelId,
    retry: false,
  });
};

export const useModelsByIds = (modelIds: number[]) => {
  return useQueries({
    queries: modelIds.map((modelId) => ({
      queryKey: ["model-by-id", modelId],
      queryFn: () => fetchModelById(modelId),
      enabled: !!modelId,
      retry: false,
    })),
  });
};
