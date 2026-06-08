export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type MyCourseOffering = {
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
};
