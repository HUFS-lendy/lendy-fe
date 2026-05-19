export interface RegisterItemsExcelRequest {
  isConfirm: boolean;
  file: File;
}

export interface ExcelPreviewItem {
  serial: string;
  categoryName: string;
  modelName: string;
  acquiredAt: string;
  status: string;
}

export interface RegisterItemsExcelData {
  addCount: number;
  updateCount: number;
  deleteCount: number;
  addedItems?: ExcelPreviewItem[];
  updatedItems?: ExcelPreviewItem[];
  deletedItems?: ExcelPreviewItem[];
}

export interface RegisterItemsExcelResponse {
  success: boolean;
  code: string;
  message: string;
  data: RegisterItemsExcelData;
}

export type ItemState =
  | "AVAILABLE"
  | "RESERVED"
  | "RENTED"
  | "BREAKDOWN"
  | "LOST";

export type AdminItem = {
  itemId: number;
  modelId: number;
  serial: string;
  state: ItemState;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = {
  success: boolean;
  code: string;
  message: string;
  data: T;
};

export type CreateAdminItemRequest = {
  modelId: number;
  serial: string;
  state: ItemState;
  acquiredAt: string;
};

export type UpdateAdminItemRequest = {
  itemId: number;
  modelId: number;
  serial: string;
  state: ItemState;
  acquiredAt: string;
};