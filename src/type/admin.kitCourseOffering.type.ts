export interface KitCourseOffering {
  kitCourseOfferingId: number;
  academicTermId: number;
  academicTermCode: string;
  courseId: number;
  courseName: string;
  modelId: number;
  modelName: string;
  assistantUserId: number;
  assistantUsername: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export type CreateKitCourseOfferingRequest = {
  academicTermId: number;
  courseId: number;
  modelId: number;
  assistantUserId: number;
};

export type UpdateKitCourseOfferingRequest = {
  modelId: number;
  assistantUserId: number;
  active: boolean;
};

export type KitInventoryItem = {
  itemId: number;
  serial: string;
  itemState: "AVAILABLE" | "RESERVED" | "RENTED" | "BREAKDOWN" | "LOST";
  kitAssignmentId: number | null;
  assignmentStatus: "ASSIGNED" | "RENTED" | "RETURNED" | "CANCELLED" | null;
  userId: number | null;
  username: string | null;
  studentId: string | null;
  email: string | null;
  assignedAt: string | null;
  rentedAt: string | null;
  returnedAt: string | null;
};
