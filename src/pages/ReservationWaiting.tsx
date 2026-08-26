import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import {
  getReservationQueueStatus,
  joinReservationQueue,
  useDoReserve,
} from "../api/reservationUser.api";
import type { ReservationQueueData } from "../type/reservationUser.type";

const ReservationWaiting = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modelId = Number(searchParams.get("modelId"));
  const [queue, setQueue] = useState<ReservationQueueData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const reservationStarted = useRef(false);
  const { mutateAsync: reserve } = useDoReserve();

  const completeReservation = useCallback(
    async (admissionToken?: string | null) => {
      if (reservationStarted.current) return;
      reservationStarted.current = true;
      try {
        await reserve({ modelId, admissionToken });
        navigate("/lending-state", {
          replace: true,
          state: { reservationCompleted: true },
        });
      } catch (cause) {
        reservationStarted.current = false;
        setError(
          cause instanceof Error ? cause.message : "예약 신청에 실패했습니다.",
        );
      }
    },
    [modelId, navigate, reserve],
  );

  useEffect(() => {
    if (!Number.isInteger(modelId) || modelId <= 0) {
      setError("예약할 기자재 정보가 올바르지 않습니다.");
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const handleStatus = async (data: ReservationQueueData) => {
      if (cancelled) return;
      setQueue(data);

      if (data.status === "DISABLED") {
        await completeReservation();
        return;
      }
      if (data.status === "READY") {
        await completeReservation(data.admissionToken);
        return;
      }
      if (data.status === "NOT_JOINED") {
        const joined = await joinReservationQueue();
        await handleStatus(joined);
        return;
      }

      timer = setTimeout(async () => {
        try {
          await handleStatus(await getReservationQueueStatus());
        } catch (cause) {
          if (!cancelled) {
            setError(
              cause instanceof Error
                ? cause.message
                : "대기열 상태를 확인하지 못했습니다.",
            );
          }
        }
      }, 1500 + Math.floor(Math.random() * 1000));
    };

    const start = async () => {
      setError(null);
      reservationStarted.current = false;
      try {
        await handleStatus(await joinReservationQueue());
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof Error
              ? cause.message
              : "예약 대기열에 접속하지 못했습니다.",
          );
        }
      }
    };

    void start();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [completeReservation, modelId, retryKey]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#060a0c] px-6 py-24 text-white">
      <section className="mx-auto max-w-xl rounded-2xl border border-neutral-700 bg-[#11141b] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <LoaderCircle className="h-9 w-9 animate-spin" aria-hidden="true" />
        </div>

        <h1 className="text-2xl font-bold">예약 접속 대기 중</h1>
        <p className="mt-3 break-keep text-sm leading-6 text-neutral-300">
          안정적인 예약 처리를 위해 순서대로 입장하고 있습니다. 이 페이지를
          닫거나 새로고침하지 말고 잠시 기다려 주세요.
        </p>

        {!error && queue?.status === "WAITING" && (
          <div className="mt-8 rounded-xl border border-neutral-700 bg-black/30 p-6">
            <div className="text-sm text-neutral-400">현재 대기 순번</div>
            <div className="mt-2 text-4xl font-bold">
              {queue.position?.toLocaleString() ?? "-"}
              <span className="ml-1 text-lg font-normal">번째</span>
            </div>
            <div className="mt-3 text-sm text-neutral-400">
              예상 대기 시간 약 {queue.estimatedWaitSeconds ?? 0}초
            </div>
          </div>
        )}

        {!error && queue?.status === "READY" && (
          <p className="mt-8 text-green-400">입장 완료. 예약을 처리하고 있습니다.</p>
        )}

        {!error && !queue && (
          <p className="mt-8 text-neutral-400">대기열에 접속하고 있습니다.</p>
        )}

        {error && (
          <div className="mt-8 rounded-xl border border-red-900 bg-red-950/30 p-5">
            <p className="break-keep text-sm text-red-300">{error}</p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                type="button"
                className="rounded-md border border-neutral-500 px-4 py-2 text-sm hover:bg-white/10"
                onClick={() => navigate("/lend", { replace: true })}
              >
                기자재 선택으로 돌아가기
              </button>
              <button
                type="button"
                className="rounded-md bg-white px-4 py-2 text-sm text-black hover:bg-neutral-200"
                onClick={() => setRetryKey((value) => value + 1)}
              >
                다시 시도
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ReservationWaiting;
