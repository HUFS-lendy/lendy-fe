export interface ModelItem {
  modelId: number;
  categoryId: number;
  categoryName: string;
  type: string;
  name: string;
  courseName: string;
  availableQty: number;
}

export interface ModelsResponse {
  success: boolean;
  code: string;
  message: string;
  data: ModelItem[];
}
