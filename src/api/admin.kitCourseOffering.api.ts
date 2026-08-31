import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  ApiResponse,
  CreateKitCourseOfferingRequest,
  UpdateKitCourseOfferingRequest,
  KitCourseOffering,
  KitInventoryItem,
} from "../type/admin.kitCourseOffering.type";

const KIT_COURSE_OFFERINGS_QUERY_KEY = ["kit-course-offerings"];

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<ApiResponse<null>>(error))
    return error.response?.data?.message ?? fallbackMessage;
  if (error instanceof Error) return error.message;
  return fallbackMessage;
};

// 전체 KIT 강의 운영 조회
const fetchKitCourseOfferings = async (): Promise<KitCourseOffering[]> => {
  const res = await apiClient.get<ApiResponse<KitCourseOffering[]>>(
    "/api/admin/kit-course-offerings",
  );
  if (!res.data.success)
    throw new Error(
      res.data.message || "KIT 강의 운영 목록 조회에 실패했습니다.",
    );
  return res.data.data ?? [];
};

export const useKitCourseOfferings = () => {
  return useQuery<KitCourseOffering[]>({
    queryKey: KIT_COURSE_OFFERINGS_QUERY_KEY,
    queryFn: fetchKitCourseOfferings,
  });
};

const fetchKitCourseOffering = async (id: number): Promise<KitCourseOffering> => {
  const res = await apiClient.get<ApiResponse<KitCourseOffering>>(
    `/api/admin/kit-course-offerings/${id}`,
  );
  if (!res.data.success)
    throw new Error(res.data.message || "KIT 강의 운영 조회에 실패했습니다.");
  return res.data.data;
};

export const useKitCourseOffering = (id?: number) =>
  useQuery({
    queryKey: [...KIT_COURSE_OFFERINGS_QUERY_KEY, id],
    queryFn: () => fetchKitCourseOffering(id as number),
    enabled: !!id,
  });

const fetchKitInventory = async (id: number): Promise<KitInventoryItem[]> => {
  const res = await apiClient.get<ApiResponse<KitInventoryItem[]>>(
    `/api/admin/kit-course-offerings/${id}/inventory`,
  );
  if (!res.data.success)
    throw new Error(res.data.message || "KIT 운영 현황 조회에 실패했습니다.");
  return res.data.data ?? [];
};

export const useKitInventory = (id?: number) =>
  useQuery({
    queryKey: [...KIT_COURSE_OFFERINGS_QUERY_KEY, id, "inventory"],
    queryFn: () => fetchKitInventory(id as number),
    enabled: !!id,
  });

// KIT 강의 운영 생성
const createKitCourseOffering = async (
  request: CreateKitCourseOfferingRequest,
): Promise<ApiResponse<KitCourseOffering>> => {
  const res = await apiClient.post<ApiResponse<KitCourseOffering>>(
    "/api/admin/kit-course-offerings",
    request,
  );
  if (!res.data.success)
    throw new Error(res.data.message || "KIT 강의 운영 생성에 실패했습니다.");
  return res.data;
};

export const useCreateKitCourseOffering = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKitCourseOffering,
    onSuccess: async (response) => {
      toast.success(response.message || "KIT 강의 운영이 생성되었습니다.");
      await queryClient.invalidateQueries({
        queryKey: KIT_COURSE_OFFERINGS_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "KIT 강의 운영 생성에 실패했습니다."));
    },
  });
};

// KIT 강의 운영 수정
const updateKitCourseOffering = async ({
  id,
  request,
}: {
  id: number;
  request: UpdateKitCourseOfferingRequest;
}): Promise<ApiResponse<KitCourseOffering>> => {
  const res = await apiClient.patch<ApiResponse<KitCourseOffering>>(
    `/api/admin/kit-course-offerings/${id}`,
    request,
  );
  if (!res.data.success)
    throw new Error(res.data.message || "KIT 강의 운영 수정에 실패했습니다.");
  return res.data;
};

export const useUpdateKitCourseOffering = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateKitCourseOffering,
    onSuccess: async (response) => {
      toast.success(response.message || "KIT 강의 운영이 수정되었습니다.");
      await queryClient.invalidateQueries({
        queryKey: KIT_COURSE_OFFERINGS_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "KIT 강의 운영 수정에 실패했습니다."));
    },
  });
};

// KIT 강의 운영 삭제
const deleteKitCourseOffering = async (
  id: number,
): Promise<ApiResponse<unknown>> => {
  const res = await apiClient.delete<ApiResponse<unknown>>(
    `/api/admin/kit-course-offerings/${id}`,
  );
  if (!res.data.success)
    throw new Error(res.data.message || "KIT 강의 운영 삭제에 실패했습니다.");
  return res.data;
};

export const useDeleteKitCourseOffering = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteKitCourseOffering,
    onSuccess: async (response) => {
      toast.success(response.message || "KIT 강의 운영이 삭제되었습니다.");
      await queryClient.invalidateQueries({
        queryKey: KIT_COURSE_OFFERINGS_QUERY_KEY,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "KIT 강의 운영 삭제에 실패했습니다."));
    },
  });
};
