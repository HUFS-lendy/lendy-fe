import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { type Reservation } from "../type/adminReservation.type";

// 전체 예약 조회 - 관리자
const fetchReservations = async (itemId: number): Promise<Reservation[]> => {
  const reservations_res = await apiClient.get(
    `/api/admin/reservations/items/${itemId}`,
  );
  return reservations_res.data.content;
};

export const useReservations = (itemId: number) => {
  return useQuery<Reservation[]>({
    queryKey: ["reservations"],
    queryFn: () => fetchReservations(itemId),
  });
};
