import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  AdminItem,
  ApiResponse,
  CreateAdminItemRequest,
  RegisterItemsExcelRequest,
  RegisterItemsExcelResponse,
  UpdateAdminItemRequest,
} from "../type/adminItem.type";

const fetchItemAvailable = async (modelId: number) => {
  const response = await apiClient.get<ApiResponse<AdminItem[]>>(
    `/api/admin/items/available`,
    {
      params: { modelId },
    },
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

// 상세 관리용: 특정 모델의 전체 item 목록 조회
const fetchAdminItemsByModel = async (
  modelId: number,
): Promise<AdminItem[]> => {
  const res = await apiClient.get<ApiResponse<AdminItem[]>>("/api/admin/items", {
    params: { modelId },
  });
  return res.data.data;
};

export const useAdminItemsByModel = (modelId?: number) => {
  return useQuery({
    queryKey: ["admin_items", modelId],
    queryFn: () => fetchAdminItemsByModel(modelId as number),
    enabled: !!modelId,
  });
};

// item 단건 등록
export const useCreateAdminItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAdminItemRequest) => {
      const res = await apiClient.post<ApiResponse<AdminItem[]>>(
        "/api/admin/items",
        [payload],
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin_items", variables.modelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["item-available", variables.modelId],
      });
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

// item 수정
export const useUpdateAdminItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, ...payload }: UpdateAdminItemRequest) => {
      const res = await apiClient.patch<ApiResponse<AdminItem>>(
        `/api/admin/items/${itemId}`,
        payload,
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin_items", variables.modelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["item-available", variables.modelId],
      });
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

// item 삭제
export const useDeleteAdminItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      modelId,
    }: {
      itemId: number;
      modelId: number;
    }) => {
      const res = await apiClient.delete<ApiResponse<null>>(
        `/api/admin/items/${itemId}`,
      );
      return { ...res.data, modelId };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin_items", variables.modelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["item-available", variables.modelId],
      });
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
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
        queryClient.invalidateQueries({ queryKey: ["admin_items"] });
        queryClient.invalidateQueries({ queryKey: ["item-available"] });
      }
    },
  });
};