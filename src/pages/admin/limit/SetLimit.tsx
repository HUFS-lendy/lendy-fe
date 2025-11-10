import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "../../../components/ui/calendar";

import { Button } from "../../../components/ui/button";

const SetLimit = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className="px-8 w-screen">
      {/* 브래드크럼 */}
      <div className="pt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/admin"
              >
                홈
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                반납 기한 설정
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">반납 기한 설정</div>
      </div>
      <Card className="w-full max-w-sm bg-[#060a0c] text-white border-none">
        <CardContent>
          <form>
            <div className="flex flex-col gap-12">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  년도
                </Label>
                <Input
                  className="border w-2/3 border-neutral-400 text-sm"
                  placeholder="현재 년도를 입력해주세요."
                  type="number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  학기
                </Label>
                <RadioGroup defaultValue="semester">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spring" id="spring" />
                    <Label htmlFor="spring">1학기</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fall" id="fall" />
                    <Label htmlFor="fall">2학기</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  종강일
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <div
                      className="
      inline-block w-fit
      border bg-neutral-900 border-neutral-400 
      hover:bg-neutral-800 rounded-sm 
      px-3 py-1 cursor-pointer
    "
                    >
                      {date ? date.toLocaleDateString() : "날짜 선택"}
                    </div>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto rounded-2xl overflow-hidden p-0 bg-white text-black border border-black/10"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(d) => {
                        setDate(d);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-12 mb-12">
          <Button className="w-full border bg-neutral-900 border-neutral-400 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer">
            설정
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetLimit;
