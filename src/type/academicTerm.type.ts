export type AcademicTerm = {
  id: number;
  year: number;
  term: string;
  code: string;
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
  term: string;
  endDate: string;
  active: boolean;
};
