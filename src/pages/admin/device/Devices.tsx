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
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { DeviceCategoryCombobox } from "../../../components/ui/DeviceCategory";

const Devices = () => {
  const navigate = useNavigate();
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
              <BreadcrumbPage className="text-white">기기 현황</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">기자재 현황</div>
        <div className="flex space-x-4 justify-end">
          {/* 기자재 추가 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                추가
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>기자재 추가</AlertDialogTitle>
                <AlertDialogDescription>
                  새 기자재를 추가하면 됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="pb-2">카테고리</Label>
                  <DeviceCategoryCombobox />
                </div>
                <div>
                  <Label className="pb-2">기자재명</Label>
                  <Input />
                </div>
                <div>
                  <Label className="pb-2">기자재 대수</Label>
                  <Input type="number" />
                </div>
                {/* todo: 여러개 엔터로 입력되게 */}
                <div>
                  <Label className="pb-2">코드 번호</Label>
                  <Input type="number" />
                </div>
              </div>
              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction>추가</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* 기자재 삭제 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300">
                삭제
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  아이패드 Air 기자재를 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  기자재를 삭제하면 다시 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction className="bg-red-600 hover:bg-red-500 font-bold">
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="mt-4">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableHead></TableHead>
              <TableHead className="text-white text-center">분류</TableHead>
              <TableHead className="text-white text-center">기자재명</TableHead>
              <TableHead className="text-white text-center">
                잔여 대수
              </TableHead>
              <TableHead className="text-white text-center">예약 중</TableHead>
              <TableHead className="text-white text-center">
                대여 완료
              </TableHead>
              <TableHead className="text-white text-center">총합</TableHead>
            </TableHeader>
            <TableBody className="cursor-pointer">
              <TableRow onClick={() => navigate("/admin/devices/1")}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </TableCell>
                <TableCell>태블릿</TableCell>
                <TableCell>아이패드 Air</TableCell>
                <TableCell>7</TableCell>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell className="font-bold">10</TableCell>
              </TableRow>
              <TableRow onClick={() => navigate("/admin/devices/1")}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </TableCell>
                <TableCell>노트북</TableCell>
                <TableCell>삼성 노트북</TableCell>
                <TableCell>6</TableCell>
                <TableCell>2</TableCell>
                <TableCell>2</TableCell>
                <TableCell className="font-bold">10</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Devices;
