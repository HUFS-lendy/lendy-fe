import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, Clock3, Laptop, LogOut, UserRound } from "lucide-react";
import Logo from "../assets/cse-logo.png";
import { getReservationQueueStatus, joinReservationQueue } from "../api/reservationUser.api";
import { clearReservationAdmission, saveReservationAdmission } from "../lib/reservationAdmission";
import type { ReservationQueueData } from "../type/reservationUser.type";
import useAuth from "../hooks/useAuth";
import Lend from "./Lend";
import { useMe } from "../api/user.api";

type View = "TIME" | "RESERVATION";
const pad = (value: number) => String(value).padStart(2, "0");
const dateText = (date: Date) => `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}.`;
const timeText = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const ReservationWaiting = () => {
  const { logout } = useAuth();
  const { data: me } = useMe();
  const [view, setView] = useState<View>("TIME");
  const [queue, setQueue] = useState<ReservationQueueData | null>(null);
  const [serverNow, setServerNow] = useState<Date | null>(null);
  const [admitted, setAdmitted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const serverOffset = useRef(0);

  const applyStatus = useCallback((data: ReservationQueueData) => {
    serverOffset.current = new Date(data.serverTime).getTime() - Date.now();
    setServerNow(new Date(data.serverTime));
    setQueue(data);
    if (data.status === "READY" && data.admissionToken) {
      saveReservationAdmission(data.admissionToken, data.admissionExpiresInSeconds);
      setAdmitted(true);
    }
    if (data.status === "DISABLED") setAdmitted(true);
    if (data.status === "BEFORE_OPEN" || data.status === "CLOSED") {
      clearReservationAdmission();
      setAdmitted(false);
    }
  }, []);

  useEffect(() => {
    const clock = setInterval(() => setServerNow(new Date(Date.now() + serverOffset.current)), 250);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const data = await getReservationQueueStatus();
        if (!cancelled) applyStatus(data);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "서버에 연결할 수 없습니다.");
      }
    };
    void check();
    const timer = setInterval(() => void check(), 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [applyStatus]);

  const openAt = queue?.reservationOpenAt ? new Date(queue.reservationOpenAt) : null;
  const canEnter = queue?.status !== "BEFORE_OPEN" && queue?.status !== "CLOSED" && queue !== null;
  const secondsUntilOpen = openAt && serverNow
    ? Math.max(0, Math.ceil((openAt.getTime() - serverNow.getTime()) / 1000))
    : null;
  const remainingText = secondsUntilOpen === null
    ? "확인 중"
    : secondsUntilOpen <= 0
      ? "예약이 시작되었습니다"
      : `${Math.floor(secondsUntilOpen / 3600) > 0 ? `${Math.floor(secondsUntilOpen / 3600)}시간 ` : ""}${Math.floor((secondsUntilOpen % 3600) / 60)}분 ${secondsUntilOpen % 60}초 남음`;

  const enterReservation = async () => {
    setView("RESERVATION");
    if (!canEnter || joining) return;
    setJoining(true);
    setError(null);
    try {
      applyStatus(await joinReservationQueue());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "입장 요청에 실패했습니다.");
    } finally {
      setJoining(false);
    }
  };

  const navClass = (active: boolean) => [
    "flex w-full items-center gap-3 border-l-2 px-5 py-4 text-left text-sm transition",
    active ? "border-white bg-white/10 text-white" : "border-transparent text-neutral-400 hover:bg-white/5 hover:text-white",
    "cursor-pointer",
  ].join(" ");

  return (
    <div className="flex min-h-screen bg-[#060a0c] text-white">
      <aside className="fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-white/10 bg-[#080c10]">
        <a href="/" className="flex h-24 items-center gap-3 border-b border-white/10 px-6">
          <img src={Logo} alt="로고" className="h-10 w-10" />
          <div>
            <p className="text-[11px] tracking-wider text-neutral-500">HUFS CSE</p>
            <p className="mt-0.5 text-sm font-semibold">기자재 예약 시스템</p>
          </div>
        </a>

        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <UserRound className="h-4 w-4 text-neutral-300" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{me?.username ?? "사용자"}</p>
              <p className="mt-0.5 truncate text-xs text-neutral-500">{me?.studentId ?? "-"}</p>
            </div>
          </div>
        </div>

        <p className="px-6 pb-2 pt-6 text-[10px] font-medium tracking-[0.16em] text-neutral-600">MENU</p>
        <nav>
          <button type="button" className={navClass(view === "TIME")} onClick={() => setView("TIME")}>
            <Clock3 className="h-4 w-4" />
            <span>서버시간</span>
          </button>
          <button type="button" className={navClass(view === "RESERVATION")} onClick={() => void enterReservation()}>
            <Laptop className="h-4 w-4" />
            <span>기자재 예약</span>
          </button>
        </nav>
        <button type="button" className="mt-auto flex items-center gap-3 px-5 py-5 text-sm text-neutral-500 hover:text-white" onClick={async () => { await logout(); window.location.href = "/"; }}>
          <LogOut className="h-4 w-4" /> 로그아웃
        </button>
      </aside>

      <main className="ml-64 min-h-screen w-[calc(100%-16rem)] px-12 py-12">
        {view === "TIME" && (
          <section className="mx-auto max-w-5xl">
            <p className="text-xs tracking-[0.14em] text-neutral-500">RESERVATION SERVICE</p>
            <h1 className="mt-2 text-2xl font-semibold">서버시간</h1>
            <div className="relative mt-8 overflow-hidden border border-white/15 bg-[#0d1319] shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              <div className="absolute inset-y-0 left-0 w-1 bg-white" />
              <div className="flex items-center justify-between gap-8 px-8 py-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white/[0.06]">
                    <CalendarClock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-500">RESERVATION OPENS</p>
                    <p className="mt-1.5 text-base font-semibold text-white">기자재 예약 시작 일시</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-sm font-medium text-neutral-400 tabular-nums">{openAt ? dateText(openAt) : "-"}</p>
                    <p className="mt-0.5 font-mono text-3xl font-semibold tracking-tight text-white tabular-nums">{openAt ? timeText(openAt) : "--:--:--"}</p>
                  </div>
                  <div className="min-w-32 bg-white px-4 py-3 text-center text-black">
                    <p className="text-[10px] font-semibold tracking-wider text-neutral-500">COUNTDOWN</p>
                    <p className="mt-1 text-sm font-bold tabular-nums">{remainingText}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 border border-white/10 bg-[#0b1015] px-8 py-20 text-center shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
              <p className="mb-8 text-[11px] font-medium tracking-[0.18em] text-neutral-500">CURRENT SERVER TIME</p>
              <p className="text-base text-neutral-400">{serverNow ? dateText(serverNow) : "-"}</p>
              <p className="mt-3 font-mono text-7xl font-light tracking-tight tabular-nums xl:text-8xl">
                {serverNow ? timeText(serverNow) : "--:--:--"}
              </p>
            </div>
          </section>
        )}

        {view === "RESERVATION" && (
          <section className="mx-auto max-w-6xl">
            {!admitted && queue?.status === "BEFORE_OPEN" && (
              <>
                <h1 className="text-xl font-semibold">기자재 예약</h1>
                <div className="mt-8 border border-white/10 bg-[#0b1015] px-8 py-20 text-center">
                  <p className="text-xl font-semibold">현재 기자재 예약 가능 시각이 아닙니다.</p>
                  <p className="mt-5 text-sm text-neutral-400">예약 시작 일시</p>
                  <p className="mt-2 text-lg font-medium tabular-nums">{openAt ? `${dateText(openAt)} ${timeText(openAt)}` : "-"}</p>
                </div>
              </>
            )}
            {!admitted && queue?.status === "CLOSED" && (
              <>
                <h1 className="text-xl font-semibold">기자재 예약</h1>
                <div className="mt-8 border border-white/10 bg-[#0b1015] px-8 py-20 text-center">
                  <p className="text-xl font-semibold">기자재 예약 기간이 종료되었습니다.</p>
                </div>
              </>
            )}
            {!admitted && queue && queue.status !== "BEFORE_OPEN" && queue.status !== "CLOSED" && (
              <>
                <h1 className="text-xl font-semibold">기자재 예약</h1>
                <div className="mt-8 border border-white/10 bg-[#0b1015] px-8 py-20 text-center">
                  <p className="text-5xl font-semibold tabular-nums">{queue?.position?.toLocaleString() ?? "-"}</p>
                  <p className="mt-4 text-sm text-neutral-400">대기 순번</p>
                  <p className="mt-2 text-sm text-neutral-500">{joining ? "입장 요청 중" : `예상 대기 ${queue?.estimatedWaitSeconds ?? 0}초`}</p>
                </div>
              </>
            )}
            {admitted && <Lend embedded />}
          </section>
        )}

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      </main>
    </div>
  );
};

export default ReservationWaiting;
