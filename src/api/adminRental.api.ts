import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import type { CreateRentalRequest, Rental } from "../type/adminRental.type";

// 대여 승인 (예약 -> 대여 전환)
export const useCreateRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reservationId, itemId }: CreateRentalRequest) => {
      const res = await apiClient.post<Rental>("/api/admin/rentals", {
        reservationId,
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
