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
