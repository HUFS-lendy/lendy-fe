import { useMemo } from "react";
import { ItemCombobox } from "./ItemCombobox";
import { useAdminUsers } from "../../api/admin.api";
import type { AdminUser } from "../../type/admin.type";

type TAComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function TACombobox({ value, onChange }: TAComboboxProps) {
  const { data, isLoading, isError } = useAdminUsers({
    roles: "TA",
    page: 0,
    size: 100,
  });

  const users = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if ("content" in data && Array.isArray(data.content)) return data.content;
    return [];
  }, [data]);

  const taItems = useMemo(() => {
    return users
      .filter(
        (user: AdminUser) => String(user.role).trim().toUpperCase() === "TA",
      )
      .map((user: AdminUser) => ({
        value: String(user.userId),
        label: user.username,
      }));
  }, [users]);

  return (
    <ItemCombobox
      value={value}
      onChange={onChange}
      items={taItems}
      disabled={isLoading || isError}
      placeholder={isLoading ? "조교 불러오는 중" : "조교 선택"}
      searchPlaceholder="조교 검색"
      emptyText={
        isError
          ? "조교 목록 조회에 실패했습니다."
          : "검색에 맞는 조교가 없습니다."
      }
      triggerClassName="w-full"
      contentClassName="w-[--radix-popover-trigger-width]"
    />
  );
}
