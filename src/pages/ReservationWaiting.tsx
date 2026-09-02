import { useCallback, useEffect, useRef, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { CalendarClock, Clock3, Laptop, LogOut, UserRound } from "lucide-react";
import Logo from "../assets/cse-logo.png";
import { getReservationQueueStatus, joinReservationQueue } from "../api/reservationUser.api";
import { clearReservationAdmission, saveReservationAdmission } from "../lib/reservationAdmission";
import type { ReservationQueueData } from "../type/reservationUser.type";
import useAuth from "../hooks/useAuth";
import Lend, { type ReservationPreviewState } from "./Lend";
import { useMe } from "../api/user.api";
import { useAcademicTerms } from "../api/academicTerm.api";

type View = "TIME" | "RESERVATION";
const pad = (value: number) => String(value).padStart(2, "0");
const dateText = (date: Date) => `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}.`;
const timeText = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const ReservationWaiting = ({ preview = false }: { preview?: boolean }) => {
  const [searchParams] = useSearchParams();
  const requestedStage = searchParams.get("stage") ?? "countdown";
  const previewStage = ["hidden", "countdown", "before-open", "waiting", "selection", "confirm", "pledge", "success", "limit", "failure"].includes(requestedStage) ? requestedStage : "countdown";
  const { logout } = useAuth();
  const { data: me } = useMe();
  const { data: academicTerms = [] } = useAcademicTerms(preview);
  const [view, setView] = useState<View>("TIME");
  const [queue, setQueue] = useState<ReservationQueueData | null>(null);
  const [serverNow, setServerNow] = useState<Date | null>(null);
  const [admitted, setAdmitted] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewWaitSeconds, setPreviewWaitSeconds] = useState(8);
  const serverOffset = useRef(0);

  const applyStatus = useCallback((data: ReservationQueueData) => {
    serverOffset.current = new Date(data.serverTime).getTime() - Date.now();
    setServerNow(new Date(data.serverTime));
    setQueue(data);
    if (data.status === "READY" && data.admissionToken) {
      if (!preview) saveReservationAdmission(data.admissionToken, data.admissionExpiresInSeconds);
      setAdmitted(true);
    }
    if (data.status === "DISABLED" || data.status === "CLOSED") {
      if (data.status === "CLOSED") clearReservationAdmission();
      setAdmitted(true);
      if (data.status === "CLOSED") setView("RESERVATION");
    }
    if (data.status === "BEFORE_OPEN") {
      if (!preview) clearReservationAdmission();
      setAdmitted(false);
    }
  }, [preview]);

  useEffect(() => {
    const clock = setInterval(() => setServerNow(new Date(Date.now() + serverOffset.current)), 250);
    return () => clearInterval(clock);
  }, []);

  useEffect(() => {
    if (preview) {
      const now = new Date();
      const openAt = new Date(now.getTime() + 15 * 60 * 1000);
      setError(null);
      setAdmitted(false);
      setView(previewStage === "countdown" || previewStage === "hidden" ? "TIME" : "RESERVATION");
      applyStatus({
        status: previewStage === "hidden" ? "NOT_VISIBLE" : ["countdown", "before-open"].includes(previewStage) ? "BEFORE_OPEN" : previewStage === "waiting" ? "WAITING" : "READY",
        position: previewStage === "waiting" ? 37 : null,
        estimatedWaitSeconds: Math.ceil(37 / 5),
        admissionToken: ["selection", "confirm", "pledge", "success", "limit", "failure"].includes(previewStage) ? "preview-admission" : null,
        admissionExpiresInSeconds: 300,
        serverTime: now.toISOString(),
        reservationQueueVisibleAt: now.toISOString(),
        reservationOpenAt: openAt.toISOString(),
      });
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const check = async () => {
      let nextDelay = 5000 + Math.floor(Math.random() * 1000);
      try {
        const data = await getReservationQueueStatus();
        if (!cancelled) {
          applyStatus(data);
          if (data.status === "WAITING") {
            nextDelay = 1250 + Math.floor(Math.random() * 1000);
          } else if (data.status === "NOT_VISIBLE" && data.reservationQueueVisibleAt) {
            const secondsLeft = Math.max(
              0,
              (new Date(data.reservationQueueVisibleAt).getTime() - new Date(data.serverTime).getTime()) / 1000,
            );
            nextDelay = secondsLeft <= 30 ? 1000 : 30000;
          } else if (data.status === "BEFORE_OPEN" && data.reservationOpenAt) {
            const secondsLeft = Math.max(
              0,
              (new Date(data.reservationOpenAt).getTime() - new Date(data.serverTime).getTime()) / 1000,
            );
            nextDelay = secondsLeft <= 30
              ? 900 + Math.floor(Math.random() * 400)
              : 4000 + Math.floor(Math.random() * 2000);
          }
        }
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "서버에 연결할 수 없습니다.");
        nextDelay = 5000;
      }
      if (!cancelled) timer = setTimeout(() => void check(), nextDelay);
    };
    void check();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [applyStatus, preview, previewStage]);

  useEffect(() => {
    if (!preview || queue?.status !== "WAITING") return;
    if (previewWaitSeconds <= 0) {
      applyStatus({ ...queue, status: "READY", position: null, estimatedWaitSeconds: 0, admissionToken: "preview-admission", admissionExpiresInSeconds: 300 });
      return;
    }
    const timer = window.setTimeout(() => setPreviewWaitSeconds((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [applyStatus, preview, previewWaitSeconds, queue]);

  const openAt = queue?.reservationOpenAt ? new Date(queue.reservationOpenAt) : null;
  const configuredReservationOpenAt = academicTerms.find((term) => term.active)?.reservationOpenAt
    ?? [...academicTerms].sort((a, b) => b.id - a.id).find((term) => term.reservationOpenAt)?.reservationOpenAt
    ?? null;
  const configuredQueueVisibleAt = academicTerms.find((term) => term.active)?.reservationQueueVisibleAt
    ?? [...academicTerms].sort((a, b) => b.id - a.id).find((term) => term.reservationQueueVisibleAt)?.reservationQueueVisibleAt
    ?? null;
  const sidebarOpenAt = preview && configuredReservationOpenAt ? new Date(configuredReservationOpenAt) : openAt;
  const queueVisibleAt = preview
    ? configuredQueueVisibleAt ? new Date(configuredQueueVisibleAt) : null
    : queue?.reservationQueueVisibleAt ? new Date(queue.reservationQueueVisibleAt) : null;
  const canEnter = queue?.status !== "BEFORE_OPEN" && queue !== null;
  const enterReservation = async () => {
    setView("RESERVATION");
    if (preview) {
      if (queue?.status === "BEFORE_OPEN") return;
      setPreviewWaitSeconds(8);
      setQueue((current) => current ? {
        ...current,
        status: "WAITING",
        position: 37,
        estimatedWaitSeconds: 8,
      } : current);
      return;
    }
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

  if (preview && me && me.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const previewToolbar = preview ? (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 border border-emerald-400/30 bg-[#10171c] px-4 py-3 shadow-2xl">
      <span className="text-xs font-semibold text-emerald-400">관리자 시뮬레이션</span>
      <select value={previewStage} onChange={(event) => { window.location.search = `?stage=${event.target.value}`; }} className="border border-white/20 bg-[#060a0c] px-3 py-1.5 text-sm text-white outline-none">
        <option value="hidden">서비스 공개 전</option><option value="countdown">예약 시작 전 서버시간</option><option value="before-open">예약 시작 전 메뉴 선택</option><option value="waiting">대기열 입장</option><option value="selection">기자재 선택</option><option value="confirm">예약 확인</option><option value="pledge">서약 조항</option><option value="success">예약 완료</option><option value="limit">학기당 1대 제한</option><option value="failure">예약 실패</option>
      </select>
      <button type="button" className="text-xs text-neutral-400 hover:text-white" onClick={() => window.close()}>닫기</button>
    </div>
  ) : null;

  if (!preview && queue === null && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060a0c] text-white">
        <div className="text-center">
          <img src={Logo} alt="컴퓨터공학부 로고" className="mx-auto h-14 w-14 opacity-80" />
          <p className="mt-5 text-sm text-neutral-500">예약 서비스 정보를 확인하고 있습니다.</p>
        </div>
      </div>
    );
  }

  if (queue?.status === "NOT_VISIBLE") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060a0c] px-6 text-white">
        {previewToolbar}
        <div className="relative w-full max-w-xl overflow-hidden border border-white/10 bg-[#0b1015] px-10 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <img src={Logo} alt="컴퓨터공학부 로고" className="mx-auto h-14 w-14" />
          <p className="mt-6 text-xs tracking-[0.16em] text-neutral-500">HUFS CSE EQUIPMENT SERVICE</p>
          <h1 className="mt-3 text-2xl font-semibold">기자재 예약 서비스 이용 안내</h1>
          <p className="mt-4 text-sm leading-6 text-neutral-400">기자재 예약 서비스는 아래 일시부터 이용할 수 있습니다.</p>
          <div className="mx-auto mt-7 max-w-sm border-y border-white/10 bg-white/[0.025] px-6 py-5">
            <p className="text-xs font-medium tracking-wide text-neutral-500">예약 서비스 이용 가능 일시</p>
            <p className="mt-3 text-sm text-neutral-400 tabular-nums">{queueVisibleAt ? dateText(queueVisibleAt) : "확인 중"}</p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-wide text-white tabular-nums">{queueVisibleAt ? timeText(queueVisibleAt) : "--:--:--"}</p>
          </div>
          <p className="mt-6 text-sm text-neutral-500">공개 시각 이후 다시 접속해 주시기 바랍니다.</p>
          <button type="button" className="mt-8 border border-white/20 px-5 py-2.5 text-sm text-neutral-300 transition hover:bg-white/10 hover:text-white" onClick={() => { window.location.href = "/"; }}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!preview && admitted && view === "RESERVATION") {
    return <Lend />;
  }

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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/[0.05]">
              <CalendarClock className="h-4 w-4 text-neutral-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium tracking-wide text-neutral-500">기자재 예약 시작 시간</p>
              <p className="mt-1.5 text-[11px] text-neutral-500 tabular-nums">{sidebarOpenAt ? dateText(sidebarOpenAt) : "-"}</p>
              <p className="mt-0.5 font-mono text-base font-semibold tracking-wide text-white tabular-nums">{sidebarOpenAt ? timeText(sidebarOpenAt) : "--:--:--"}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <UserRound className="h-4 w-4 text-neutral-300" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{preview ? "홍길동" : me?.username ?? "사용자"}</p>
              <p className="mt-0.5 truncate text-xs text-neutral-500">{preview ? "202699999" : me?.studentId ?? "-"}</p>
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
        {preview && (
          <div className="mx-auto mb-6 flex max-w-6xl items-center justify-between border border-white/10 bg-white/[0.04] px-5 py-3 text-xs text-neutral-400">
            <span>관리자 미리보기 · 실제 대기열과 연결되지 않습니다.</span>
            <button type="button" className="text-white hover:underline" onClick={() => window.close()}>미리보기 닫기</button>
          </div>
        )}
        {view === "TIME" && (
          <section className="mx-auto max-w-5xl">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs tracking-[0.16em] text-neutral-600">RESERVATION SERVICE</p>
                <h1 className="mt-2 text-2xl font-semibold">서버시간</h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />실시간 동기화</div>
            </div>

            <div className="relative mx-auto mt-8 max-w-4xl overflow-hidden border border-white/10 bg-[#0b1015] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
              <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="flex min-h-[430px] flex-col items-center justify-center px-8 py-14 text-center">
                <div className="flex items-center gap-3 text-xs tracking-[0.1em] text-neutral-500"><span className="h-px w-8 bg-white/20" />{serverNow ? dateText(serverNow) : "-"}<span className="h-px w-8 bg-white/20" /></div>
                <p className="mt-7 font-mono text-7xl font-light tracking-[-0.045em] text-white tabular-nums sm:text-8xl xl:text-[104px]">
                  {serverNow ? timeText(serverNow) : "--:--:--"}
                </p>
              </div>
            </div>
          </section>
        )}

        {view === "RESERVATION" && (
          <section className="mx-auto max-w-6xl">
            {!admitted && queue?.status === "BEFORE_OPEN" && (
              <div className="flex min-h-[70vh] items-center justify-center">
                <div className="relative w-full max-w-xl overflow-hidden border border-white/10 bg-[#0b1015] px-10 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                  <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white/10 bg-white/[0.04]"><CalendarClock className="h-6 w-6 text-neutral-300" /></div>
                  <p className="mt-6 text-xs tracking-[0.16em] text-neutral-500">RESERVATION SCHEDULE</p>
                  <h1 className="mt-3 text-2xl font-semibold">아직 예약 접수 시간이 아닙니다</h1>
                  <p className="mt-3 text-sm leading-6 text-neutral-400">기자재 예약은 아래 시각부터 이용할 수 있습니다.</p>
                  <div className="mx-auto mt-7 max-w-sm border-y border-white/10 bg-white/[0.025] px-6 py-5">
                    <p className="text-xs font-medium tracking-wide text-neutral-500">기자재 예약 시작 시간</p>
                    <p className="mt-3 text-sm text-neutral-400 tabular-nums">{sidebarOpenAt ? dateText(sidebarOpenAt) : "확인 중"}</p>
                    <p className="mt-1 font-mono text-2xl font-semibold tracking-wide text-white tabular-nums">{sidebarOpenAt ? timeText(sidebarOpenAt) : "--:--:--"}</p>
                  </div>
                  <p className="mt-6 text-sm text-neutral-500">시작 시간 이후 다시 이용해 주시기 바랍니다.</p>
                </div>
              </div>
            )}
            {!admitted && queue && queue.status !== "BEFORE_OPEN" && (
              <div className="flex min-h-[70vh] items-center justify-center">
                <div className="w-full max-w-lg border border-white/15 bg-[#0b1015] px-10 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
                  <img src={Logo} alt="컴퓨터공학부 로고" className="mx-auto h-16 w-16" />
                  <p className="mt-6 text-xs tracking-[0.16em] text-neutral-500">RESERVATION QUEUE</p>
                  <h1 className="mt-3 text-2xl font-semibold">잠시 후 예약 화면으로 이동합니다</h1>
                  <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 divide-x divide-white/10 border-y border-white/10 py-5">
                    <div><p className="text-3xl font-semibold tabular-nums">{queue.position?.toLocaleString() ?? "-"}</p><p className="mt-2 text-xs text-neutral-500">현재 대기 순번</p></div>
                    <div><p className="text-3xl font-semibold tabular-nums">{preview ? previewWaitSeconds : queue.estimatedWaitSeconds ?? 0}<span className="ml-1 text-base">초</span></p><p className="mt-2 text-xs text-neutral-500">예상 입장 시간</p></div>
                  </div>
                  <p className="mt-7 text-sm text-neutral-400">순서가 되면 자동으로 예약 화면에 입장합니다.</p>
                </div>
              </div>
            )}
            {admitted && <Lend embedded preview={preview} previewState={previewStage as ReservationPreviewState} />}
          </section>
        )}

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}
      </main>
      {previewToolbar}
    </div>
  );
};

export default ReservationWaiting;
