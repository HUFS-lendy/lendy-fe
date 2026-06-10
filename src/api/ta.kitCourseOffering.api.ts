import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  ApiResponse,
  MyCourseOffering,
} from "../type/ta.kitCourseOffering.type";

// 내 KIT 강의 운영 목록 조회
const fetchMyCourse = async (): Promise<MyCourseOffering[]> => {
  const res = await apiClient.get<ApiResponse<MyCourseOffering[]>>(
    "/api/ta/kit-course-offerings/me",
  );
  if (!res.data.success)
    throw new Error(
      res.data.message || "내 KIT 강의 운영 목록 조회에 실패했습니다.",
    );
  return res.data.data ?? [];
};

export const useMyCourse = () => {
  return useQuery<MyCourseOffering[]>({
    queryKey: ["my-course"],
    queryFn: fetchMyCourse,
  });
};
