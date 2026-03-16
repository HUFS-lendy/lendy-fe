export type UserMe = {
  userId: number;
  username: string;
  studentId: string;
  role: string;
  state: string;
  email: string;
  phone: string;
};

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};
