import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  Reservation,
  ReservationListResponse,
} from "../type/adminReservation.type";

// 예약 단건 조회
const fetchReservation = async (itemId: number): Promise<Reservation[]> => {
  const reservations_res = await apiClient.get(
    `/api/admin/reservations/items/${itemId}`,
  );
  return reservations_res.data.content;
};

export const useReservation = (itemId: number) => {
  return useQuery<Reservation[]>({
    queryKey: ["reservations"],
    queryFn: () => fetchReservation(itemId),
  });
};

// 대여된 예약 조회
const fetchConvertedReservations = async (
  semester: string,
  page: number = 0,
  size: number = 20,
  sort?: string[],
) => {
  const res = await apiClient.get("/api/admin/reservations", {
    params: {
      status: "CONVERTED",
      semester,
      page,
      size,
      sort,
    },
  });

  return res.data.data as ReservationListResponse;
};

export const useConvertedReservations = (
  semester: string,
  page: number = 0,
  size: number = 20,
  sort?: string[],
) => {
  return useQuery({
    queryKey: ["reservations", "CONVERTED", semester, page, size, sort],
    queryFn: () => fetchConvertedReservations(semester, page, size, sort),
    enabled: !!semester,
  });
};
