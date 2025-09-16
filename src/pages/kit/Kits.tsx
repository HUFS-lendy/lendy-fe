import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Checkbox } from "../../components/ui/checkbox";
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
} from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const Kits = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white">
      {/* 브래드크럼 */}
      <div className="pt-20">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/"
              >
                홈
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                실습키트 현황
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">실습키트 현황</div>
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
                <AlertDialogTitle>실습 키트 추가</AlertDialogTitle>
                <AlertDialogDescription>
                  새 키트를 추가하면 됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4">
                <div className="flex space-x-8">
                  <div>
                    <Label className="pb-2">강의명</Label>
                    <Input />
                  </div>
                  <div>
                    <Label className="pb-2">교수명</Label>
                    <Input />
                  </div>
                </div>
                <div>
                  <Label className="pb-2">실습 키트명</Label>
                  <Input />
                </div>
                <div>
                  <Label className="pb-2">키트 수량</Label>
                  <Input type="number" />
                </div>
                {/* todo: 여러개 엔터로 입력되게 */}
                <div>
                  <Label className="pb-2">키트 번호</Label>
                  <Input />
                </div>
              </div>
              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction>추가</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* 키트 삭제 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300">
                삭제
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Cortex-M3 키트를 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  키트를 삭제하면 다시 되돌릴 수 없습니다.
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
              <TableHead className="text-white text-center">키트명</TableHead>
              <TableHead className="text-white text-center">
                사용 수업명
              </TableHead>
              <TableHead className="text-white text-center">교수명</TableHead>
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
              <TableRow onClick={() => navigate("/admin/kits/2")}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </TableCell>
                <TableCell>Cortex-M3</TableCell>
                <TableCell>마이크로프로세서 및 실습</TableCell>
                <TableCell>임승호</TableCell>
                <TableCell>5</TableCell>
                <TableCell>12</TableCell>
                <TableCell>3</TableCell>
                <TableCell className="font-bold">20</TableCell>
              </TableRow>
              <TableRow onClick={() => navigate("/admin/kits/2")}>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </TableCell>
                <TableCell>아두이노</TableCell>
                <TableCell>컴퓨터시스템입문</TableCell>
                <TableCell>이재혁</TableCell>
                <TableCell>3</TableCell>
                <TableCell>17</TableCell>
                <TableCell>40</TableCell>
                <TableCell className="font-bold">60</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Kits;
