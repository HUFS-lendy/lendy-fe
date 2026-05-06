import { useState, type WheelEvent } from "react";
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

type ItemComboboxProps = {
  value: string;
  onChange: (value: string) => void;
  items: { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  triggerClassName?: string;
  contentClassName?: string;
  listClassName?: string;
};

export function ItemCombobox({
  value,
  onChange,
  items,
  disabled = false,
  placeholder = "기기 선택",
  searchPlaceholder = "기기 검색",
  emptyText = "검색에 맞는 기기가 없습니다.",
  triggerClassName,
  contentClassName,
  listClassName,
}: ItemComboboxProps) {
  const [open, setOpen] = useState(false);

  const handleCommandListWheel = (event: WheelEvent<HTMLDivElement>) => {
    const list = event.currentTarget;

    if (list.scrollHeight <= list.clientHeight) return;

    event.preventDefault();
    event.stopPropagation();

    let deltaY = event.deltaY;

    if (event.deltaMode === 1) deltaY *= 16;
    if (event.deltaMode === 2) deltaY *= list.clientHeight;

    list.scrollTop += deltaY;
  };

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <PopoverTrigger className="border-none shadow-none" asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "w-[200px] justify-between disabled:opacity-50 disabled:cursor-not-allowed",
            triggerClassName,
          )}
        >
          <span className="truncate">
            {value
              ? items.find((item) => item.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-[260px] p-0 z-[100] overflow-hidden",
          contentClassName,
        )}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList
            onWheelCapture={handleCommandListWheel}
            className={cn(
              "max-h-[280px] overflow-y-scroll overscroll-contain touch-pan-y",
              listClassName,
            )}
          >
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  disabled={disabled}
                  onSelect={() => {
                    const nextValue = item.value === value ? "" : item.value;
                    onChange(nextValue);
                    setOpen(false);
                  }}
                >
                  <span className="whitespace-normal break-keep">
                    {item.label}
                  </span>
                  <Check
                    className={cn(
                      "ml-auto shrink-0",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
