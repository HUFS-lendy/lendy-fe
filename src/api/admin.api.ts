import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";

export type UserRole = "ADMIN" | "USER";
export type UserState = "ACTIVE" | "BANNED";

export type AdminUser = {
  userId: number;
  username: string;
  studentId: string;
  role: UserRole;
  state: UserState;
  email: string;
  phone: string;
};

export type AdminUsersResponseData = {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type GetAdminUsersParams = {
  roles?: string;
  states?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
};

type UpdateUserRequest = {
  userId: number;
  role: "ADMIN" | "USER";
  state: "ACTIVE" | "BANNED";
  email: string;
  phone: string;
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
