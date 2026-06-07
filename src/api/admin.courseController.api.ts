import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { ApiResponse, Course } from "../type/api.courseController.type";

// 전체 과목 목록 조회 - 관리자
const fetchCourses = async (): Promise<Course[]> => {
  const res = await apiClient.get<ApiResponse<Course[]>>("/api/admin/courses");
  return res.data.data;
};

export const useCourses = () => {
  return useQuery<Course[]>({
    queryKey: ["admin-courses"],
    queryFn: fetchCourses,
  });
};
