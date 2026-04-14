export interface Reservation {
  reservationId: number;
  userId: number;
  username: string;
  studentId: string;
  email: string;
  phone: string;
  modelId: number;
  modelName: string;
  semester: string;
  status: string;
  reservedAt: Date;
  expiresAt: Date;
  convertedAt: Date;
  cancelledAt: Date;
}

export interface ReservationItem {
  reservationId: number;
  userId: number;
  studentId: string;
  username: string;
  category: string;
  modelName: string;
  itemSerial: string;
  semester: string;
  reservedAt: string;
  expiresAt: string;
  status: string;
}

export interface ReservationListResponse {
  content: ReservationItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
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
