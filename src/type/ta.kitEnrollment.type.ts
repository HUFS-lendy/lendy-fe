export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type CreateInternalEnrollmentRequest = {
  studentId: string;
};

export type BatchEnrollmentResult = {
  requestedCount: number;
  registeredCount: number;
  duplicatedCount: number;
  notFoundCount: number;
  registeredStudentIds: string[];
  duplicatedStudentIds: string[];
  notFoundStudentIds: string[];
};

export type CreateGuestEnrollmentRequest = {
  username: string;
  studentId: string;
  departmentName: string;
  email: string;
};

export type CourseEnrollment = {
  enrollmentId: number;
  userId: number;
  username: string;
  studentId: string;
  email: string;
  departmentName: string;
  role: string;
  status: string;
  createdAt?: string;
};
