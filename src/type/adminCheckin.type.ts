export interface CheckinItem {
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

export interface CheckinListResponse {
  content: CheckinItem[];
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
