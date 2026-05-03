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
