import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  MyReservationsResponse,
  ApiResponse,
} from "../type/reservationUser.type";
import { isAxiosError } from "axios";

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

const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiResponse<null>>(error)) {
    return error.response?.data?.message ?? "대여 신청에 실패했습니다.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "대여 신청에 실패했습니다.";
};

// 예약 신청
export const useDoReserve = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ modelId }: { modelId: number }) => {
      try {
        const doReserveRes = await apiClient.post<ApiResponse<unknown>>(
          "/api/reservations",
          { modelId },
        );

        if (!doReserveRes.data.success) {
          throw new Error(
            doReserveRes.data.message || "대여 신청에 실패했습니다.",
          );
        }

        return doReserveRes.data.data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

// 예약 취소
export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: number) => {
      const delete_reservation_res = await apiClient.delete(
        `/api/reservations/${reservationId}`,
      );
      return delete_reservation_res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-reservations"] });
    },
  });
};
