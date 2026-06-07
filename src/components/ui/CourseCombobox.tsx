import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCourses } from "../../api/admin.courseController.api";
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

type CourseComboboxProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CourseCombobox({ value, onChange }: CourseComboboxProps) {
  const [open, setOpen] = useState(false);
  const { data: courses = [], isLoading, isError } = useCourses();

  const selectedCourse = courses.find(
    (course) => String(course.courseId) === value,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCourse
            ? `${selectedCourse.name} (${selectedCourse.code})`
            : "강의 선택"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="강의 검색" className="h-9" />
          <CommandList>
            {isLoading ? (
              <CommandEmpty>강의 목록을 불러오는 중입니다.</CommandEmpty>
            ) : isError ? (
              <CommandEmpty>강의 목록 조회에 실패했습니다.</CommandEmpty>
            ) : (
              <>
                <CommandEmpty>검색에 맞는 강의가 없습니다.</CommandEmpty>
                <CommandGroup>
                  {courses.map((course) => {
                    const courseValue = String(course.courseId);
                    const label = `${course.name} (${course.code})`;

                    return (
                      <CommandItem
                        key={course.courseId}
                        value={label}
                        onSelect={() => {
                          onChange(courseValue === value ? "" : courseValue);
                          setOpen(false);
                        }}
                      >
                        {label}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === courseValue ? "opacity-100" : "opacity-0",
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
