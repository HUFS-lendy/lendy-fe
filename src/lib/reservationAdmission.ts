const STORAGE_KEY = "lendy-reservation-admission";

type StoredAdmission = { token: string; expiresAt: number };

export const saveReservationAdmission = (token: string, ttlSeconds: number) => {
  const admission: StoredAdmission = {
    token,
    expiresAt: Date.now() + ttlSeconds * 1000,
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(admission));
};

export const getReservationAdmission = (): string | null => {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const admission = JSON.parse(raw) as StoredAdmission;
    if (!admission.token || admission.expiresAt <= Date.now()) {
      clearReservationAdmission();
      return null;
    }
    return admission.token;
  } catch {
    clearReservationAdmission();
    return null;
  }
};

export const clearReservationAdmission = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};
