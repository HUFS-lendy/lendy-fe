import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getReservationQueueStatus } from "../api/reservationUser.api";

const ReservationEntryGate = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<"CHECKING" | "ALLOWED" | "WAITING">("CHECKING");

  useEffect(() => {
    if (state !== "CHECKING") return;
    let cancelled = false;
    getReservationQueueStatus()
      .then((queue) => {
        if (cancelled) return;
        if (["BEFORE_OPEN", "NOT_VISIBLE", "CLOSED"].includes(queue.status)) {
          setState("WAITING");
        } else {
          setState("ALLOWED");
        }
      })
      .catch(() => setState("WAITING"));
    return () => {
      cancelled = true;
    };
  }, [state]);

  if (state === "CHECKING") return null;
  if (state === "WAITING") return <Navigate to="/reservation-waiting" replace />;
  return children;
};

export default ReservationEntryGate;
