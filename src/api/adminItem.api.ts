import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  RegisterItemsExcelRequest,
  RegisterItemsExcelResponse,
} from "../type/adminItem.type";

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

// 기자재(단품) 엑셀 일괄 등록 및 미리보기
export const useRegisterItemsByExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ isConfirm, file }: RegisterItemsExcelRequest) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post<RegisterItemsExcelResponse>(
        "/api/admin/items/excel",
        formData,
        { params: { isConfirm } },
      );

      return res.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.isConfirm) {
        queryClient.invalidateQueries({ queryKey: ["models"] });
      }
    },
  });
};
