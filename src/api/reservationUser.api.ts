import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { MyReservationsResponse } from "../type/reservationUser";

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
