import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { CheckinListResponse } from "../type/adminCheckin.type";

// 대여 전환 대상 예약 목록 조회
const fetchCheckinList = async (
  keyword: string,
  page: number = 0,
  size: number = 20,
) => {
  const response = await apiClient.get("/api/admin/check-in/reservations", {
    params: {
      keyword,
      page,
      size,
    },
  });

  return response.data.data as CheckinListResponse;
};

export const useCheckinList = (
  keyword: string,
  page: number = 0,
  size: number = 20,
) => {
  return useQuery({
    queryKey: ["check-in", keyword, page, size],
    queryFn: () => fetchCheckinList(keyword, page, size),
  });
};
