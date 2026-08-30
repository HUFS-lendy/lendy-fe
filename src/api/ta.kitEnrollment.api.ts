import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  ApiResponse,
  CourseEnrollment,
  CreateGuestEnrollmentRequest,
  CreateInternalEnrollmentRequest,
  BatchEnrollmentResult,
} from "../type/ta.kitEnrollment.type";

const getCourseEnrollmentsQueryKey = (kitCourseOfferingId: number) => [
  "course-enrollments",
  kitCourseOfferingId,
];

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<ApiResponse<null>>(error))
    return error.response?.data?.message ?? fallbackMessage;
  if (error instanceof Error) return error.message;
  return fallbackMessage;
};

// 특정 KIT 강의 운영의 수강생 목록 조회
const fetchCourseEnrollments = async (
  kitCourseOfferingId: number,
): Promise<CourseEnrollment[]> => {
  const res = await apiClient.get<ApiResponse<CourseEnrollment[]>>(
    `/api/ta/kit-course-offerings/${kitCourseOfferingId}/enrollments`,
  );
  if (!res.data.success)
    throw new Error(res.data.message || "수강생 목록 조회에 실패했습니다.");
  return res.data.data ?? [];
};

export const useCourseEnrollments = (kitCourseOfferingId: number) => {
  return useQuery<CourseEnrollment[]>({
    queryKey: getCourseEnrollmentsQueryKey(kitCourseOfferingId),
    queryFn: () => fetchCourseEnrollments(kitCourseOfferingId),
    enabled: Number.isFinite(kitCourseOfferingId) && kitCourseOfferingId > 0,
  });
};

// 내부 학생 수강 등록
const createInternalEnrollment = async ({
  kitCourseOfferingId,
  request,
}: {
  kitCourseOfferingId: number;
  request: CreateInternalEnrollmentRequest;
}): Promise<ApiResponse<CourseEnrollment>> => {
  const res = await apiClient.post<ApiResponse<CourseEnrollment>>(
    `/api/ta/kit-course-offerings/${kitCourseOfferingId}/enrollments/internal`,
    request,
  );
  if (!res.data.success)
    throw new Error(res.data.message || "내부 학생 수강 등록에 실패했습니다.");
  return res.data;
};

export const useCreateInternalEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInternalEnrollment,
    onSuccess: async (response, variables) => {
      toast.success(response.message || "내부 학생이 등록되었습니다.");
      await queryClient.invalidateQueries({
        queryKey: getCourseEnrollmentsQueryKey(variables.kitCourseOfferingId),
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "내부 학생 수강 등록에 실패했습니다."),
      );
    },
  });
};

export const useCreateInternalEnrollmentsBatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ kitCourseOfferingId, studentIds }: { kitCourseOfferingId: number; studentIds: string[] }) => {
      const res = await apiClient.post<ApiResponse<BatchEnrollmentResult>>(
        `/api/ta/kit-course-offerings/${kitCourseOfferingId}/enrollments/internal/batch`,
        { studentIds },
      );
      if (!res.data.success) throw new Error(res.data.message || "수강생 일괄 등록에 실패했습니다.");
      return res.data;
    },
    onSuccess: async (response, variables) => {
      const result = response.data;
      toast.success(`신규 ${result.registeredCount}명 등록 완료`, {
        description: `중복 ${result.duplicatedCount}명 · 미가입/등록불가 ${result.notFoundCount}명`,
      });
      await queryClient.invalidateQueries({ queryKey: getCourseEnrollmentsQueryKey(variables.kitCourseOfferingId) });
    },
    onError: (error) => toast.error(getErrorMessage(error, "수강생 일괄 등록에 실패했습니다.")),
  });
};

// 게스트 학생 수강 등록
const createGuestEnrollment = async ({
  kitCourseOfferingId,
  request,
}: {
  kitCourseOfferingId: number;
  request: CreateGuestEnrollmentRequest;
}): Promise<ApiResponse<CourseEnrollment>> => {
  const res = await apiClient.post<ApiResponse<CourseEnrollment>>(
    `/api/ta/kit-course-offerings/${kitCourseOfferingId}/enrollments/guest`,
    request,
  );
  if (!res.data.success)
    throw new Error(
      res.data.message || "게스트 학생 수강 등록에 실패했습니다.",
    );
  return res.data;
};

export const useCreateGuestEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGuestEnrollment,
    onSuccess: async (response, variables) => {
      toast.success(response.message || "게스트 학생이 등록되었습니다.");
      await queryClient.invalidateQueries({
        queryKey: getCourseEnrollmentsQueryKey(variables.kitCourseOfferingId),
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "게스트 학생 수강 등록에 실패했습니다."),
      );
    },
  });
};

const dropEnrollments = async ({
  kitCourseOfferingId,
  kitEnrollmentIds,
}: {
  kitCourseOfferingId: number;
  kitEnrollmentIds: number[];
}): Promise<ApiResponse<unknown>[]> => {
  if (kitEnrollmentIds.length === 0)
    throw new Error("Drop 처리할 수강생을 선택해주세요.");

  const res = await apiClient.patch<ApiResponse<unknown>>(
    `/api/ta/kit-course-offerings/${kitCourseOfferingId}/enrollments/drop-batch`,
    { kitEnrollmentIds },
  );
  if (!res.data.success) throw new Error(res.data.message || "수강 취소 처리에 실패했습니다.");
  return [res.data];
};

export const useDropEnrollments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dropEnrollments,
    onSuccess: async (responses, variables) => {
      const serverMessage = responses.length === 1 ? responses[0].message : "";
      toast.success(
        serverMessage ||
          `${responses.length}명의 수강 상태가 DROPPED로 변경되었습니다.`,
      );
      await queryClient.invalidateQueries({
        queryKey: getCourseEnrollmentsQueryKey(variables.kitCourseOfferingId),
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "수강 상태 Drop 처리에 실패했습니다."),
      );
    },
  });
};

const enrollEnrollments = async ({
  kitCourseOfferingId,
  kitEnrollmentIds,
}: {
  kitCourseOfferingId: number;
  kitEnrollmentIds: number[];
}): Promise<ApiResponse<unknown>[]> => {
  if (kitEnrollmentIds.length === 0)
    throw new Error("Enroll 처리할 수강생을 선택해주세요.");

  const res = await apiClient.patch<ApiResponse<unknown>>(
    `/api/ta/kit-course-offerings/${kitCourseOfferingId}/enrollments/enroll-batch`,
    { kitEnrollmentIds },
  );
  if (!res.data.success) throw new Error(res.data.message || "수강 등록 처리에 실패했습니다.");
  return [res.data];
};

export const useEnrollEnrollments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enrollEnrollments,
    onSuccess: async (responses, variables) => {
      const serverMessage = responses.length === 1 ? responses[0].message : "";
      toast.success(
        serverMessage ||
          `${responses.length}명의 수강 상태가 ENROLLED로 변경되었습니다.`,
      );
      await queryClient.invalidateQueries({
        queryKey: getCourseEnrollmentsQueryKey(variables.kitCourseOfferingId),
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "수강 상태 Enroll 처리에 실패했습니다."),
      );
    },
  });
};
