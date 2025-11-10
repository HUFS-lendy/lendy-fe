import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "../../../components/ui/calendar";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { SemesterCombobox } from "../../../components/ui/SemesterCombobox";
import { toast } from "sonner";

const ViewLimit = () => {
  const navigate = useNavigate();
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
                종강일 설정 현황
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">
          종강일 설정 현황
        </div>
        <div className="flex space-x-4 justify-end">
          {/* 종강일 추가 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                추가
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>종강일 추가</AlertDialogTitle>
                <AlertDialogDescription>
                  새 종강일을 추가하면 됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="pb-2">년도</Label>
                  <Input className="w-1/3" />
                </div>
                <div>
                  <Label className="pb-2">학기</Label>
                  <SemesterCombobox />
                </div>
                <div>
                  <Label className="pb-2">날짜</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <div className="inline-block w-fit border text-sm rounded-sm px-3 py-1 cursor-pointer">
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
                <div>
                  <Label className="pb-2">현재 학기 여부</Label>
                  <RadioGroup defaultValue="semester">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spring" id="spring" />
                      <Label htmlFor="spring">예</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fall" id="fall" />
                      <Label htmlFor="fall">아니오</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => toast("종강일이 추가되었습니다.")}
                >
                  추가
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* 종강일 삭제 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300">
                삭제
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  2025-2 종강일을 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  2025-2의 종강일은 <strong>'2025-12-19'</strong>입니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => toast("해당 종강일이 삭제되었습니다.")}
                  className="bg-red-600 hover:bg-red-500 font-bold"
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {/* 종강일 테이블 */}
        <div className="mt-4">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableHead></TableHead>
              <TableHead className="text-white text-center">년도</TableHead>
              <TableHead className="text-white text-center">학기</TableHead>
              <TableHead className="text-white text-center">날짜</TableHead>
              <TableHead className="text-white text-center">
                현재 학기
              </TableHead>
            </TableHeader>
            <TableBody className="cursor-pointer">
              <TableRow onClick={() => navigate("/admin/devices/1")}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </TableCell>
                <TableCell>2025</TableCell>
                <TableCell>2</TableCell>
                <TableCell>2025-12-19</TableCell>
                <TableCell>O</TableCell>
              </TableRow>
              <TableRow onClick={() => navigate("/admin/devices/1")}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </TableCell>
                <TableCell>2025</TableCell>
                <TableCell>1</TableCell>
                <TableCell>2025-06-22</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ViewLimit;
