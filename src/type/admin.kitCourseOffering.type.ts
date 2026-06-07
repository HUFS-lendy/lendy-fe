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
