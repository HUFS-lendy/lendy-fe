import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

export type Metric = { requests:number; successful:number; clientErrors:number; serverErrors:number; reservationSuccess:number; reservationSoldOut:number; reservationFailure:number; rateLimited:number; averageMs:number; p95Ms:number; maxMs:number };
export type MinuteMetric = Metric & { minute:string; queueWaiting:number; queueActive:number };
export type Alert = { severity:"CRITICAL"|"WARNING"; code:string; title:string; message:string };
export type Overview = {
  observedAt:string; status:"HEALTHY"|"WARNING"|"CRITICAL";
  health:{ databaseHealthy:boolean; redisHealthy:boolean; databaseLatencyMs:number; redisLatencyMs:number };
  queue:{ enabled:boolean; waiting:number; active:number; capacity:number; oldestWaitSeconds:number };
  lastMinute:Metric; lastFiveMinutes:Metric;
  resources:{ usedMemoryMb:number; maxMemoryMb:number; heapPercent:number; threadCount:number; processCpuPercent:number; systemCpuPercent:number; uptimeSeconds:number; hikariActive:number; hikariIdle:number; hikariPending:number; hikariMaximum:number; version:string };
  alerts:Alert[]; today:Record<string,number>;
};
export type Inventory = { groupKey:string; displayName:string; total:number; available:number; reserved:number; rented:number; unavailable:number; recentDemand:{ attempts:number; success:number; soldOut:number; failure:number } };
export type Readiness = { checkedAt:string; ready:boolean; passed:number; total:number; checks:{ code:string; title:string; passed:boolean; required:boolean; detail:string }[] };
export type SecurityEvent = { occurredAt:string; type:string; subject:string };

const data = async <T,>(url:string):Promise<T> => (await apiClient.get(url)).data.data;
export const useOperationsOverview = () => useQuery({ queryKey:["operations-overview"], queryFn:()=>data<Overview>("/api/admin/operations/overview"), refetchInterval:5000 });
export const useOperationsTimeline = (minutes=60) => useQuery({ queryKey:["operations-timeline",minutes], queryFn:()=>data<MinuteMetric[]>(`/api/admin/operations/timeseries?minutes=${minutes}`), refetchInterval:15000 });
export const useOperationsInventory = () => useQuery({ queryKey:["operations-inventory"], queryFn:()=>data<Inventory[]>("/api/admin/operations/inventory?minutes=5"), refetchInterval:10000 });
export const useOperationsReadiness = () => useQuery({ queryKey:["operations-readiness"], queryFn:()=>data<Readiness>("/api/admin/operations/readiness"), refetchInterval:30000 });
export const useOperationsIncidents = () => useQuery({ queryKey:["operations-incidents"], queryFn:()=>data<SecurityEvent[]>("/api/admin/operations/incidents?limit=50"), refetchInterval:10000 });
