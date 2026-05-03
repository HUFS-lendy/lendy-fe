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
}

// 수기 대여 등록 승인 요청 타입
export interface CreateManualRentalRequest {
  studentId: string;
  itemId: number;
}
