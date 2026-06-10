export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
};

export type KitAssignment = {
  kitAssignmentId: number;
  userId: number;
  username: string;
  studentId: string;
  itemId: number;
  serial: string;
  status: string;
  assignedAt: string;
  reservationId: number | null;
  rentalId: number | null;
};

export type GenerateKitAssignmentsResult = {
  totalEnrollmentCount: number;
  alreadyAssignedCount: number;
  newlyAssignedCount: number;
  notAssignedCount: number;
  alreadyAssignedStudentIds: string[];
  newlyAssignedStudentIds: string[];
  notAssignedStudentIds: string[];
};
