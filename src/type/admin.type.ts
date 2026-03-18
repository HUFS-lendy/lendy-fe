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
  role: "ADMIN" | "USER";
  state: "ACTIVE" | "BANNED";
  email: string;
  phone: string;
};
