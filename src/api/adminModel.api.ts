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
  infoVisible: boolean;
  rentalGroupKey: string;
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
  const preparedFile = await optimizeModelImage(file);
  const form = new FormData();
  form.append("file", preparedFile);
  const { data } = await apiClient.post<{ data: { url: string } }>(
    "/api/admin/notices/images",
    form,
  );
  return data.data.url;
};

const optimizeModelImage = (file: File): Promise<File> => new Promise((resolve) => {
  if (file.type === "image/gif") { resolve(file); return; }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) { URL.revokeObjectURL(url); resolve(file); return; }
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      URL.revokeObjectURL(url);
      resolve(blob ? new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" }) : file);
    }, "image/jpeg", 0.86);
  };
  image.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
  image.src = url;
});

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
