// 대여 승인 요청 타입
export interface CreateRentalRequest {
  reservationId: number;
  itemId: number;
}

// 응답 타입
export interface Rental {
  rentalId: number;
  reservationId: number;
  userId: number;
  username: string;
  modelId: number;
  modelName: string;
  itemId: number;
  semester: string;
  createdAt: string;
  dueAt: string;
  specialRental: boolean;
  specialReason?: string | null;
  specialApprovedBy?: string | null;
}

// 수기 대여 등록 승인 요청 타입
export interface CreateManualRentalRequest {
  studentId: string;
  itemId: number;
  sendMail: boolean;
  specialRental?: boolean;
  reason?: string;
}

// 반납 조회 타입
export interface AdminReturnItem {
  rentalId: number;
  itemId: number;
  modelId: number;
  modelName: string;
  serial: string;
  userId: number;
  username: string;
  studentId: string;
  email: string;
  semester: string;
  rentedAt: string;
  dueAt: string | null;
  specialRental: boolean;
  specialReason?: string | null;
  specialApprovedBy?: string | null;
}

export interface AdminReturnsPage {
  content: AdminReturnItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};
