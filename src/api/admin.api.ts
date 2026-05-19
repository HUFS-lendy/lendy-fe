import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  GetAdminUsersParams,
  AdminUsersResponseData,
  AdminUser,
  ApiResponse,
  UpdateUserRequest,
} from "../type/admin.type";

// 에러 메시지 추출 공통 함수
const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<ApiResponse<null>>(error))
    return error.response?.data?.message ?? fallbackMessage;
  if (error instanceof Error) return error.message;
  return fallbackMessage;
};

// success: false가 HTTP 200으로 내려오는 경우까지 대비
const checkApiSuccess = <T>(response: ApiResponse<T>) => {
  if (!response.success) throw new Error(response.message);
  return response;
};

// 전체 유저 조회
const fetchAdminUsers = async (
  params: GetAdminUsersParams = {},
): Promise<AdminUsersResponseData> => {
  const {
    roles = "",
    states = "",
    keyword = "",
    page = 0,
    size = 10,
    sort = "",
  } = params;

  const res = await apiClient.get<ApiResponse<AdminUsersResponseData>>(
    "/api/admin/users",
    {
      params: { roles, states, keyword, page, size, sort },
    },
  );

  return res.data.data;
};

export const useAdminUsers = (params: GetAdminUsersParams = {}) => {
  return useQuery({
    queryKey: ["admin_users", params],
    queryFn: () => fetchAdminUsers(params),
  });
};

// 개별 유저 조회
const fetchUser = async (userId: number): Promise<AdminUser> => {
  const res = await apiClient.get<ApiResponse<AdminUser>>(
    `/api/admin/users/${userId}`,
  );
  return res.data.data;
};

export const useFetchUser = (userId?: number) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId as number),
    enabled: !!userId,
  });
};

// 유저 정보 수정
export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
      state,
      email,
    }: UpdateUserRequest): Promise<ApiResponse<AdminUser>> => {
      const res = await apiClient.patch<ApiResponse<AdminUser>>(
        `/api/admin/users/${userId}`,
        { role, state, email},
      );
      return checkApiSuccess(res.data);
    },
    onSuccess: (data) => {
      toast.success(data.message ?? "유저 정보가 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "유저 정보 수정에 실패했습니다."));
    },
  });
};

// 유저 삭제
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number): Promise<ApiResponse<null>> => {
      const res = await apiClient.delete<ApiResponse<null>>(
        `/api/admin/users/${userId}`,
      );
      return checkApiSuccess(res.data);
    },
    onSuccess: (data) => {
      toast.success(data.message ?? "유저가 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "유저 삭제에 실패했습니다."));
    },
  });
};
