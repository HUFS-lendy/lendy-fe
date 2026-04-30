import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

const fetchItemAvailable = async (modelId: number) => {
  const response = await apiClient.get(
    `/api/admin/items/available?modelId=${modelId}`,
  );
  return response.data.data;
};

export const useItemAvailable = (modelId: number | null) => {
  return useQuery({
    queryKey: ["item-available", modelId],
    queryFn: () => fetchItemAvailable(modelId as number),
    enabled: modelId !== null,
  });
};
