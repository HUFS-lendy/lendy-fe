export interface ModelItem {
  modelId: number;
  categoryId: number;
  categoryName: string;
  type: "EQUIPMENT" | "KIT";
  name: string;
  displayName: string;
  subName: string;
  description: string;
  visibleToUsers: boolean;
  courseName: string | null;
  availableQty: number;
  infoSummary?: string | null;
  recommendedFor?: string | null;
  specifications?: string | null;
  referenceUrl?: string | null;
  imageUrls?: string[];
}

export interface ModelsResponse {
  success: boolean;
  code: string;
  message: string;
  data: ModelItem[];
}
