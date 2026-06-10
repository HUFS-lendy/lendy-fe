import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  ApiResponse,
  CourseEnrollment,
  CreateGuestEnrollmentRequest,
  CreateInternalEnrollmentRequest,
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
