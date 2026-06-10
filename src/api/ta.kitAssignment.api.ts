import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  ApiResponse,
  GenerateKitAssignmentsResult,
  KitAssignment,
} from "../type/ta.kitAssignmnet.type";

const getKitAssignmentsQueryKey = (kitCourseOfferingId: number) => [
  "kit-assignments",
  kitCourseOfferingId,
];

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<ApiResponse<null>>(error))
    return error.response?.data?.message ?? fallbackMessage;
  if (error instanceof Error) return error.message;
  return fallbackMessage;
};

// KIT 배정 목록 조회
const fetchKitAssignments = async (
  kitCourseOfferingId: number,
): Promise<KitAssignment[]> => {
  const res = await apiClient.get<ApiResponse<KitAssignment[]>>(
    `/api/ta/kit-course-offerings/${kitCourseOfferingId}/assignments`,
  );

  if (!res.data.success)
    throw new Error(res.data.message || "KIT 배정 목록 조회에 실패했습니다.");

  return res.data.data ?? [];
};

export const useKitAssignments = (kitCourseOfferingId: number) => {
  return useQuery<KitAssignment[]>({
    queryKey: getKitAssignmentsQueryKey(kitCourseOfferingId),
    queryFn: () => fetchKitAssignments(kitCourseOfferingId),
    enabled: Number.isFinite(kitCourseOfferingId) && kitCourseOfferingId > 0,
  });
};

// KIT 자동 배정
const generateKitAssignments = async (
  kitCourseOfferingId: number,
): Promise<ApiResponse<GenerateKitAssignmentsResult>> => {
  const res = await apiClient.post<ApiResponse<GenerateKitAssignmentsResult>>(
    `/api/ta/kit-course-offerings/${kitCourseOfferingId}/assignments/generate`,
  );

  if (!res.data.success)
    throw new Error(res.data.message || "KIT 자동 배정에 실패했습니다.");

  return res.data;
};

export const useGenerateKitAssignments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateKitAssignments,
    onSuccess: async (response, kitCourseOfferingId) => {
      const result = response.data;

      toast.success(response.message || "KIT 자동 배정이 완료되었습니다.", {
        description: result
          ? `전체 ${result.totalEnrollmentCount}명 · 신규 배정 ${result.newlyAssignedCount}명 · 기존 배정 ${result.alreadyAssignedCount}명 · 미배정 ${result.notAssignedCount}명`
          : undefined,
      });

      await queryClient.invalidateQueries({
        queryKey: getKitAssignmentsQueryKey(kitCourseOfferingId),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "KIT 자동 배정에 실패했습니다."));
    },
  });
};
