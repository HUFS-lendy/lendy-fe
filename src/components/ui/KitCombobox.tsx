import { useMemo } from "react";
import { ItemCombobox } from "./ItemCombobox";
import { useModels } from "../../api/adminModel.api";
import type { ModelItem } from "../../type/adminModel.type";

type KitComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function KitCombobox({ value, onChange }: KitComboboxProps) {
  const { data, isLoading, isError } = useModels();

  const models = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (
      data &&
      typeof data === "object" &&
      "data" in data &&
      Array.isArray((data as { data: ModelItem[] }).data)
    )
      return (data as { data: ModelItem[] }).data;
    return [];
  }, [data]);

  const kitItems = useMemo(() => {
    return models
      .filter((model) => String(model.type).trim().toUpperCase() === "KIT")
      .map((model) => ({
        value: String(model.modelId),
        label: `${model.name}${model.courseName ? ` - ${model.courseName}` : ""}`,
      }));
  }, [models]);

  console.log("useModels data:", data);
  console.log("models:", models);
  console.log("kitItems:", kitItems);

  return (
    <ItemCombobox
      value={value}
      onChange={onChange}
      items={kitItems}
      disabled={isLoading || isError}
      placeholder={isLoading ? "키트 불러오는 중" : "키트 선택"}
      searchPlaceholder="키트 검색"
      emptyText={
        isError
          ? "키트 목록 조회에 실패했습니다."
          : "검색에 맞는 키트가 없습니다."
      }
      triggerClassName="w-full"
      contentClassName="w-[--radix-popover-trigger-width]"
    />
  );
}
