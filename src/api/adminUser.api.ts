import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { UserRental, RegisterExcelRequest } from "../type/adminUser.type";

// 유저 대여 기록 조회
const fetchUserRentals = async (userId: number): Promise<UserRental[]> => {
  const res = await apiClient.get(`/api/admin/users/${userId}/rentals`);

  return res.data.data.content;
};

export const useUserRentals = (userId: number) => {
  return useQuery<UserRental[]>({
    queryKey: ["user_rentals", userId],
    queryFn: () => fetchUserRentals(userId),
    enabled: !!userId,
  });
};

// 학생 정보 엑셀 일괄 등록 및 미리보기
export const useRegisterExcel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ termId, isConfirm, file }: RegisterExcelRequest) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post(
        `/api/admin/users/excel?termId=${termId}&isConfirm=${isConfirm}`,
        formData,
      );

      return res.data;
    },
    onSuccess: (_data, variables) => {
      if (variables.isConfirm) {
        queryClient.invalidateQueries({ queryKey: ["admin_users"] });
      }
    },
  });
};
