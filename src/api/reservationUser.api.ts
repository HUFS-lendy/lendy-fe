import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { MyReservationsResponse } from "../type/reservationUser.type";

// 내 예약 목록 조회
const fetchMyReservations = async (
  page: number,
  size: number,
): Promise<MyReservationsResponse> => {
  const res = await apiClient.get("/api/reservations", {
    params: {
      page,
      size,
    },
  });

  return res.data.data;
};

export const useMyReservations = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ["my-reservations", page, size],
    queryFn: () => fetchMyReservations(page, size),
  });
};

// 예약 신청
export const useDoReserve = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modelId }: { modelId: number }) => {
      const do_reserve_res = await apiClient.post("/api/reservations", {
        modelId,
      });
      return do_reserve_res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
