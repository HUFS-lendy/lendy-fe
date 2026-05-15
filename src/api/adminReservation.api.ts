import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  Reservation,
  ReservationListResponse,
  ApiResponse,
} from "../type/adminReservation.type";
import { isAxiosError } from "axios";
import { toast } from "sonner";

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

const getDeleteReservationApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiResponse<null>>(error))
    return error.response?.data?.message ?? "대여 기록 삭제에 실패했습니다.";
  if (error instanceof Error) return error.message;
  return "대여 기록 삭제에 실패했습니다.";
};

const checkApiSuccess = <T>(
  response: ApiResponse<T>,
  fallbackMessage: string,
) => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response;
};

// 예약 취소
export const useDeleteReservations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: number): Promise<ApiResponse<null>> => {
      const res = await apiClient.delete<ApiResponse<null>>(
        `/api/admin/reservations/${reservationId}`,
      );
      return checkApiSuccess(res.data, "대여 기록 삭제에 실패했습니다.");
    },
    onSuccess: (data) => {
      toast.success(
        data.message ?? "사용자의 해당 대여 내용이 삭제되었습니다.",
      );
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["user_rentals"] });
    },
    onError: (error) => {
      toast.error(getDeleteReservationApiErrorMessage(error));
    },
  });
};
