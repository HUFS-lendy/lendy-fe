import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

export type SecurityEvent = { occurredAt: string; type: string; subject: string };
export type SecuritySnapshot = {
  databaseHealthy: boolean;
  redisHealthy: boolean;
  queueWaiting: number;
  queueActive: number;
  usedMemoryMb: number;
  maxMemoryMb: number;
  threadCount: number;
  today: Record<string, number>;
  recentEvents: SecurityEvent[];
};

export const useSecurityMonitoring = () => useQuery<SecuritySnapshot>({
  queryKey: ["security-monitoring"],
  queryFn: async () => (await apiClient.get("/api/admin/security-monitoring?events=50")).data.data,
  refetchInterval: 5000,
});
