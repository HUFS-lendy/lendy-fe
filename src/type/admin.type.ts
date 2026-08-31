export type UserRole = "ADMIN" | "TA" | "USER" | "GUEST";
export type UserState = "ACTIVE" | "INACTIVE" | "BANNED";

export type AdminUser = {
  userId: number;
  username: string;
  studentId: string;
  role: UserRole;
  state: UserState;
  email: string;
};

export type AdminUsersResponseData = {
  content: AdminUser[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type ApiResponse<T> = {
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

export type UpdateUserRequest = {
  userId: number;
  role: UserRole;
  state: UserState;
  email: string;
};
