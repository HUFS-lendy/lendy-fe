import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  CreateRentalRequest,
  CreateManualRentalRequest,
  Rental,
  ApiResponse,
} from "../type/adminRental.type";
import { isAxiosError } from "axios";

// 수기 대여 등록
export const useManualRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, itemId }: CreateManualRentalRequest) => {
      const res = await apiClient.post<Rental>("/api/admin/manual-rentals", {
        studentId,
        itemId,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-in"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};

// 대여 전환 동적 메시지
const getApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiResponse<null>>(error)) {
    return error.response?.data?.message ?? "대여 전환 중 오류가 발생했습니다.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "대여 전환 중 오류가 발생했습니다.";
};

// 대여 승인 (예약 -> 대여 전환)
export const useCreateRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, itemId }: CreateRentalRequest) => {
      try {
        const res = await apiClient.post<ApiResponse<Rental>>(
          "/api/admin/rentals",
          { reservationId, itemId },
        );

        if (!res.data.success) {
          throw new Error(
            res.data.message || "대여 전환 중 오류가 발생했습니다.",
          );
        }

        return res.data;
      } catch (error) {
        throw new Error(getApiErrorMessage(error));
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-in"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};

// 기자재 반납 처리
export const useReturnReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rentalId }: { rentalId: number }) => {
      const returnReservation_res = await apiClient.patch(
        `/api/admin/rentals/${rentalId}`,
      );

      return returnReservation_res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_rentals"] });
    },
  });
};
