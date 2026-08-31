export type AcademicTermSeason = "SPRING" | "FALL";

export type AcademicTerm = {
  id: number;
  year: number;
  term: AcademicTermSeason;
  code: string;
  startDate: string;
  reservationOpenAt: string | null;
  reservationQueueCloseAt: string | null;
  endDate: string;
  active: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type CreateAcademicTermRequest = {
  year: number;
  term: AcademicTermSeason;
  startDate: string;
  reservationOpenAt: string;
  reservationQueueCloseAt: string;
  endDate: string;
  active: boolean;
};
