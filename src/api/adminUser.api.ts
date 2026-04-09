import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { type UserRental } from "../type/adminUser.type";

// 유저 대여 기록 조회
const fetchUserRentals = async (userId: number): Promise<UserRental[]> => {
  const res = await apiClient.get(`/api/admin/users/${userId}/rentals`);

  return res.data.data.content;
};

export const useUserRentals = (userId: number) => {
  return useQuery<UserRental[]>({
    queryKey: ["user_rentals", userId],
    queryFn: () => fetchUserRentals(userId),
    enabled: !!userId,
  });
};
