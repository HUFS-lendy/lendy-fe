import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { apiClient } from "./client";
import type {
  AcademicTerm,
  ApiResponse,
  CreateAcademicTermRequest,
} from "../type/academicTerm.type";

const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError<ApiResponse<null>>(error)) {
    return error.response?.data?.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};

// 전체 학기 조회 - 관리자
const fetchAcademicTerms = async (): Promise<AcademicTerm[]> => {
  const res = await apiClient.get<ApiResponse<AcademicTerm[]>>(
    "/api/admin/academic-terms",
  );
  return res.data.data;
};

export const useAcademicTerms = () => {
  return useQuery<AcademicTerm[]>({
    queryKey: ["academic_terms"],
    queryFn: fetchAcademicTerms,
  });
};

// 학기 등록
export const useCreateAcademicTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      year,
      term,
      startDate,
      endDate,
      active,
    }: CreateAcademicTermRequest) => {
      try {
        const res = await apiClient.post<ApiResponse<AcademicTerm>>(
          "/api/admin/academic-terms",
          {
            year,
            term,
            startDate,
            reservationOpenAt: `${startDate}T00:00:00`,
            endDate,
            active,
          },
        );

        if (!res.data.success) {
          throw new Error(res.data.message || "학기 추가에 실패했습니다.");
        }

        return res.data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "학기 추가에 실패했습니다."));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic_terms"] });
    },
  });
};

// 학기 삭제
export const useDeleteAcademicTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (termId: number) => {
      try {
        const res = await apiClient.delete<ApiResponse<null>>(
          `/api/admin/academic-terms/${termId}`,
        );

        if (!res.data.success) {
          throw new Error(res.data.message || "종강일 삭제에 실패했습니다.");
        }

        return res.data;
      } catch (error) {
        throw new Error(
          getApiErrorMessage(error, "종강일 삭제에 실패했습니다."),
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic_terms"] });
    },
  });
};

// 학기 정보 수정
export const useUpdateAcademicTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      termId,
      year,
      term,
      startDate,
      endDate,
      active,
    }: {
      termId: number;
      year: number;
      term: string;
      startDate: string;
      endDate: string;
      active: boolean;
    }) => {
      try {
        const res = await apiClient.patch<ApiResponse<AcademicTerm>>(
          `/api/admin/academic-terms/${termId}`,
          {
            year,
            term,
            startDate,
            reservationOpenAt: `${startDate}T00:00:00`,
            endDate,
            active,
          },
        );

        if (!res.data.success) {
          throw new Error(res.data.message || "학기 수정에 실패했습니다.");
        }

        return res.data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error, "학기 수정에 실패했습니다."));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic_terms"] });
    },
  });
};
