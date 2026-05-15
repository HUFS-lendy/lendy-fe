export type UserMe = {
  userId: number;
  username: string;
  studentId: string;
  role: string;
  state: string;
  email: string;
  phone: string;
};

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type RentalStatus = "RENTING" | "OVERDUE" | "RETURNED";

export interface MyRental {
  rentalId: number;
  category: string;
  modelName: string;
  itemSerial: string;
  semester: string;
  status: RentalStatus;
}

export interface PageSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageResponse<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: PageSort;
  numberOfElements: number;
  empty: boolean;
}

export interface MyRentalsParams {
  page?: number;
  size?: number;
  sort?: string[];
}
