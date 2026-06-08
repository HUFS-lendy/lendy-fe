import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { MyCourseOffering } from "../type/ta.kitCourseOffering.type";

// 내 KIT 강의 운영 목록 조회
const fetchMyCourse = async (): Promise<MyCourseOffering[]> => {
  const res = await apiClient.get("/api/ta/kit-course-offerings/me");
  return res.data.data;
};

export const useMyCourse = () => {
  return useQuery<MyCourseOffering[]>({
    queryKey: ["my-course"],
    queryFn: fetchMyCourse,
  });
};
