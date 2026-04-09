import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  AcademicTerm,
  ApiResponse,
  CreateAcademicTermRequest,
} from "../type/academicTerm.type";

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
      endDate,
      active,
    }: CreateAcademicTermRequest) => {
      const res = await apiClient.post<ApiResponse<AcademicTerm>>(
        "/api/admin/academic-terms",
        {
          year,
          term,
          endDate,
          active,
        },
      );
      return res.data;
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
      const delete_academic_term_res = await apiClient.delete(
        `/api/admin/academic-terms/${termId}`,
      );
      return delete_academic_term_res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-terms"] });
    },
  });
};

// 학기 정보 수정
export const useUpdateAcademicTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      termId,
      endDate,
    }: {
      termId: number;
      endDate: string;
    }) => {
      const updateAcademicTerm_res = await apiClient.patch(
        `/api/admin/academic-terms/${termId}`,
        {
          endDate,
        },
      );

      return updateAcademicTerm_res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic_terms"] });
    },
  });
};
