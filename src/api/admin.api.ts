import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  GetAdminUsersParams,
  AdminUsersResponseData,
  AdminUser,
  ApiResponse,
  UpdateUserRequest,
} from "../type/admin.type";

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
      params: {
        roles,
        states,
        keyword,
        page,
        size,
        sort,
      },
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
      phone,
    }: UpdateUserRequest) => {
      const res = await apiClient.put(`/api/admin/users/${userId}`, {
        userId,
        role,
        state,
        email,
        phone,
      });

      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_users"] });
    },
  });
};
