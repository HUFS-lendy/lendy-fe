import { Activity, Database, RefreshCw, Server, ShieldAlert, ShieldCheck, Users } from "lucide-react";
import { useSecurityMonitoring } from "../../../api/securityMonitoring.api";

const labels: Record<string, string> = {
  LOGIN_SUCCESS: "로그인 성공", LOGIN_FAILURE: "로그인 실패", QUEUE_JOIN: "예약 대기 등록",
  RESERVATION_SUCCESS: "예약 성공", RESERVATION_FAILURE: "예약 실패", PASSWORD_RESET_REQUEST: "비밀번호 재설정 요청",
};
const eventLabel = (type: string) => labels[type] || (type.startsWith("RATE_LIMITED_") ? "요청 제한 감지" : type);

export default function SecurityMonitoring() {
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useSecurityMonitoring();
  const cards = [
    ["대기 인원", data?.queueWaiting ?? 0, Users], ["입장 허용", data?.queueActive ?? 0, Activity],
    ["로그인 실패", data?.today.LOGIN_FAILURE ?? 0, ShieldAlert],
    ["요청 제한", Object.entries(data?.today || {}).filter(([key]) => key.startsWith("RATE_LIMITED_")).reduce((sum, [, value]) => sum + value, 0), ShieldCheck],
  ] as const;
  return <main className="min-h-screen bg-[#060a0c] px-8 py-14 text-white"><div className="mx-auto max-w-7xl">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs tracking-[0.22em] text-neutral-500">SECURITY & OPERATIONS</p><h1 className="mt-3 text-3xl font-bold">보안 모니터링</h1><p className="mt-2 text-sm text-neutral-400">예약 대기 상태와 비정상 요청을 5초마다 갱신합니다.</p></div><button onClick={() => void refetch()} className="flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"><RefreshCw size={15}/>새로고침</button></div>
    {isLoading ? <p className="mt-12 text-neutral-400">상태를 불러오는 중입니다.</p> : isError || !data ? <p className="mt-12 text-red-400">모니터링 정보를 불러오지 못했습니다.</p> : <>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([title, value, Icon]) => <article key={title} className="rounded-2xl border border-neutral-800 bg-[#0c1115] p-5"><Icon className="text-neutral-500" size={20}/><p className="mt-5 text-sm text-neutral-400">{title}</p><p className="mt-1 text-3xl font-bold tabular-nums">{value}</p></article>)}</section>
      <section className="mt-5 grid gap-4 lg:grid-cols-3"><Status title="데이터베이스" healthy={data.databaseHealthy} icon={Database}/><Status title="Redis·대기열" healthy={data.redisHealthy} icon={Server}/><article className="rounded-2xl border border-neutral-800 bg-[#0c1115] p-5"><p className="text-sm text-neutral-400">서버 자원</p><p className="mt-3 font-semibold">메모리 {data.usedMemoryMb.toLocaleString()} / {data.maxMemoryMb.toLocaleString()} MB</p><p className="mt-1 text-sm text-neutral-500">처리 스레드 {data.threadCount}개</p></article></section>
      <section className="mt-5 overflow-hidden rounded-2xl border border-neutral-800 bg-[#0c1115]"><div className="flex items-center justify-between border-b border-neutral-800 px-6 py-5"><h2 className="font-semibold">최근 보안·예약 이벤트</h2><span className="text-xs text-neutral-500">마지막 갱신 {new Date(dataUpdatedAt).toLocaleTimeString("ko-KR")}</span></div><div className="divide-y divide-neutral-800">{data.recentEvents.length ? data.recentEvents.map((event, index) => <div key={`${event.occurredAt}-${index}`} className="grid gap-2 px-6 py-4 text-sm sm:grid-cols-[180px_1fr_160px]"><time className="text-neutral-500">{new Date(event.occurredAt).toLocaleString("ko-KR")}</time><span className={event.type.startsWith("RATE_LIMITED_") || event.type.endsWith("FAILURE") ? "font-semibold text-red-300" : "text-neutral-200"}>{eventLabel(event.type)}</span><span className="font-mono text-neutral-500">{event.subject}</span></div>) : <p className="px-6 py-12 text-center text-neutral-500">기록된 이벤트가 없습니다.</p>}</div></section>
    </>}
  </div></main>;
}

function Status({ title, healthy, icon: Icon }: { title: string; healthy: boolean; icon: typeof Database }) {
  return <article className="rounded-2xl border border-neutral-800 bg-[#0c1115] p-5"><div className="flex items-center justify-between"><Icon size={20} className="text-neutral-500"/><span className={`h-2.5 w-2.5 rounded-full ${healthy ? "bg-emerald-400" : "bg-red-400"}`}/></div><p className="mt-5 text-sm text-neutral-400">{title}</p><p className={`mt-1 font-semibold ${healthy ? "text-white" : "text-red-300"}`}>{healthy ? "정상" : "연결 확인 필요"}</p></article>;
}
