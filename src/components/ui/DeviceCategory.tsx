import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useCategories } from "../../api/adminCategory.api";

type DeviceCategoryComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DeviceCategoryCombobox({
  value,
  onChange,
}: DeviceCategoryComboboxProps) {
  const [open, setOpen] = useState(false);
  const { data: categories = [], isLoading, isError } = useCategories();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "카테고리 선택"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="카테고리 선택" className="h-9" />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>카테고리 불러오는 중...</CommandEmpty>
            ) : isError ? (
              <CommandEmpty>카테고리를 불러오지 못했습니다.</CommandEmpty>
            ) : categories.length === 0 ? (
              <CommandEmpty>등록된 카테고리가 없습니다.</CommandEmpty>
            ) : (
              <CommandGroup>
                {categories.map((category) => (
                  <CommandItem
                    key={category.category_id}
                    value={category.name}
                    onSelect={(currentValue) => {
                      const nextValue =
                        currentValue === value ? "" : currentValue;
                      onChange(nextValue);
                      setOpen(false);
                    }}
                  >
                    {category.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === category.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
