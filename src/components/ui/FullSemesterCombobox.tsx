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
import { useAcademicTerms } from "../../api/academicTerm.api";

type FullSemesterComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FullSemesterCombobox({
  value,
  onChange,
}: FullSemesterComboboxProps) {
  const [open, setOpen] = useState(false);
  const { data: academicTerms = [], isLoading, isError } = useAcademicTerms();

  const selectedTerm = academicTerms.find((term) => String(term.id) === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTerm
            ? `${selectedTerm.code}${selectedTerm.active ? " (현재 학기)" : ""}`
            : "학기 선택"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="학기 검색" className="h-9" />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>학기 목록을 불러오는 중입니다.</CommandEmpty>
            ) : isError ? (
              <CommandEmpty>학기 목록 조회에 실패했습니다.</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>검색에 맞는 학기가 없습니다.</CommandEmpty>
                <CommandGroup>
                  {academicTerms.map((term) => {
                    const termValue = String(term.id);
                    const label = `${term.code}${term.active ? " (현재 학기)" : ""}`;

                    return (
                      <CommandItem
                        key={term.id}
                        value={termValue}
                        onSelect={() => {
                          onChange(termValue === value ? "" : termValue);
                          setOpen(false);
                        }}
                      >
                        {label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === termValue ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
