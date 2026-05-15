import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type {
  CreateRentalRequest,
  CreateManualRentalRequest,
  Rental,
  ApiResponse,
} from "../type/adminRental.type";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const getManualRentalApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiResponse<null>>(error)) {
    return error.response?.data?.message ?? "수기 대여 등록에 실패했습니다.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "수기 대여 등록에 실패했습니다.";
};

// 수기 대여 등록
export const useManualRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ studentId, itemId }: CreateManualRentalRequest) => {
      try {
        const res = await apiClient.post<ApiResponse<Rental>>(
          "/api/admin/manual-rentals",
          { studentId, itemId },
        );

        if (!res.data.success) {
          throw new Error(res.data.message || "수기 대여 등록에 실패했습니다.");
        }

        return res.data;
      } catch (error) {
        throw new Error(getManualRentalApiErrorMessage(error));
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-in"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};

// 대여 전환 동적 메시지
const getCheckInApiErrorMessage = (error: unknown) => {
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
        throw new Error(getCheckInApiErrorMessage(error));
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["check-in"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
  });
};

const getReturnRentalApiErrorMessage = (error: unknown) => {
  if (isAxiosError<ApiResponse<null>>(error))
    return error.response?.data?.message ?? "반납 처리에 실패했습니다.";
  if (error instanceof Error) return error.message;
  return "반납 처리에 실패했습니다.";
};

const checkApiSuccess = <T>(
  response: ApiResponse<T>,
  fallbackMessage: string,
) => {
  if (!response.success) throw new Error(response.message || fallbackMessage);
  return response;
};

// 기자재 반납 처리
export const useReturnReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      rentalId,
    }: {
      rentalId: number;
    }): Promise<ApiResponse<Rental>> => {
      const res = await apiClient.patch<ApiResponse<Rental>>(
        `/api/admin/rentals/${rentalId}`,
      );
      return checkApiSuccess(res.data, "반납 처리에 실패했습니다.");
    },
    onSuccess: (data) => {
      toast.success(data.message ?? "기자재가 반납 처리되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["user_rentals"] });
    },
    onError: (error) => {
      toast.error(getReturnRentalApiErrorMessage(error));
    },
  });
};
