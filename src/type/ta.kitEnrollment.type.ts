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

export type ExcelEnrollmentFailure = {
  rowNumber: number;
  studentId: string;
  username: string;
  reason: string;
};

export type ExcelEnrollmentResult = {
  totalCount: number;
  internalStudentCount: number;
  guestStudentCount: number;
  registeredCount: number;
  alreadyEnrolledCount: number;
  failedCount: number;
  failures: ExcelEnrollmentFailure[];
};

export type EnrollmentSyncStudent = {
  studentId: string;
  username: string;
  departmentName: string;
  accountType: "USER" | "GUEST";
  kitSerial?: string | null;
  note?: string;
};

export type EnrollmentSyncPreview = {
  checksum: string;
  excelStudentCount: number;
  internalStudentCount: number;
  guestStudentCount: number;
  maintainedCount: number;
  newCount: number;
  restoredCount: number;
  droppedCount: number;
  rentalBlockedCount: number;
  failedCount: number;
  maintainedStudents: EnrollmentSyncStudent[];
  newStudents: EnrollmentSyncStudent[];
  restoredStudents: EnrollmentSyncStudent[];
  droppedStudents: EnrollmentSyncStudent[];
  rentalBlockedStudents: EnrollmentSyncStudent[];
  failures: ExcelEnrollmentFailure[];
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
