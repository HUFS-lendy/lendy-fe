import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getReservationQueueStatus } from "../api/reservationUser.api";
import {
  clearReservationAdmission,
  getReservationAdmission,
  saveReservationAdmission,
} from "../lib/reservationAdmission";

const ReservationEntryGate = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<"CHECKING" | "ALLOWED" | "WAITING">("CHECKING");

  useEffect(() => {
    if (state !== "CHECKING") return;
    let cancelled = false;
    getReservationQueueStatus()
      .then((queue) => {
        if (cancelled) return;
        const storedAdmission = getReservationAdmission();
        if (queue.status === "DISABLED") {
          setState("ALLOWED");
        } else if (queue.status === "READY" && queue.admissionToken) {
          saveReservationAdmission(queue.admissionToken, queue.admissionExpiresInSeconds);
          setState("ALLOWED");
        } else if (queue.status === "READY" && storedAdmission) {
          setState("ALLOWED");
        } else {
          clearReservationAdmission();
          setState("WAITING");
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
