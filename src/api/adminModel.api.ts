import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ModelItem } from "../type/adminModel.type";

type CreateOrUpdateModelRequest = {
  categoryName: string;
  type: string;
  name: string;
  displayName: string;
  subName: string;
  description: string;
  visibleToUsers: boolean;
  courseName: string;
  totalQty: number;
  serials: string[];
  qtyAndSerialsSizeMatching?: boolean;
};

type UpdateModelRequest = CreateOrUpdateModelRequest & {
  modelId: number;
};

// 모델 등록
export const useCreateModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryName,
      type,
      name,
      displayName,
      subName,
      description,
      visibleToUsers,
      courseName,
      totalQty,
      serials,
      qtyAndSerialsSizeMatching,
    }: CreateOrUpdateModelRequest) => {
      const createModelRes = await apiClient.post("/api/admin/models", {
        categoryName,
        type,
        name,
        displayName,
        subName,
        description,
        visibleToUsers,
        courseName,
        totalQty,
        serials,
        qtyAndSerialsSizeMatching,
      });
      return createModelRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

// 모델 수정
export const useUpdateModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      modelId,
      categoryName,
      type,
      name,
      displayName,
      subName,
      description,
      visibleToUsers,
      courseName,
      totalQty,
      serials,
      qtyAndSerialsSizeMatching,
    }: UpdateModelRequest) => {
      const updateModelRes = await apiClient.patch(
        `/api/admin/models/${modelId}`,
        {
          categoryName,
          type,
          name,
          displayName,
          subName,
          description,
          visibleToUsers,
          courseName,
          totalQty,
          serials,
          qtyAndSerialsSizeMatching,
        },
      );
      return updateModelRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};

// 전체 모델 조회 - 관리자
const fetchModels = async () => {
  const modelsRes = await apiClient.get("/api/admin/models");
  return modelsRes.data.data;
};

export const useModels = () => {
  return useQuery<ModelItem[]>({
    queryKey: ["models"],
    queryFn: fetchModels,
  });
};

export type ModelInfoInput = {
  modelId: number;
  infoBadgeLabel: string;
  infoSummary: string;
  recommendedFor: string;
  specifications: string;
  referenceUrl: string;
  imageUrls: string[];
};

export const useUpdateModelInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ modelId, ...input }: ModelInfoInput) =>
      apiClient.patch(`/api/admin/models/${modelId}/info`, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["models"] }),
      ]);
    },
  });
};

export const uploadModelInfoImage = async (file: File) => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiClient.post<{ data: { url: string } }>(
    "/api/admin/notices/images",
    form,
  );
  return data.data.url;
};

// 모델 삭제
export const useDeleteModel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelId: number) => {
      const deleteModelRes = await apiClient.delete(
        `/api/admin/models/${modelId}`,
      );
      return deleteModelRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
};
