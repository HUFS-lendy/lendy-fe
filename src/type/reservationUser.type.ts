export type ReservationStatus =
  | "RESERVED"
  | "CONVERTED"
  | "CANCELLED"
  | "EXPIRED";

export interface MyReservationItem {
  reservationId: number;
  modelId: number;
  status: ReservationStatus;
  reservedAt: string;
  expiresAt: string;
  qrUrl: string | null;
}

export interface MyReservationsResponse {
  content: MyReservationItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}
