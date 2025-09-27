import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
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
} from "../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { QrModal } from "../hooks/useQrCode";

const LendState = () => {
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState<string>("불량 유형 선택");

  return (
    <div className="bg-[#060a0c] w-screen h-full px-8">
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
              <BreadcrumbPage className="text-white">대여 현황</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 페이지명 */}
      <div className="pt-8 text-white">
        <div className="font-bold text-3xl pb-8">대여 현황</div>
        {/* 불량 신청 모달/ */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex justify-end mb-4">
              <div className="bg-[#060a0c] hover:bg-neutral-700 cursor-pointer text-sm text-white border border-neutral-400 rounded-md px-3 py-1">
                불량 신청
              </div>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="pb-4">
                기자재 - 아이패드 Air(A20342)에 대한 불량 사항을 적어주세요.
              </AlertDialogTitle>
              <AlertDialogDescription className="break-keep pb-2 space-y-4">
                {/* 불량 유형 선택 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="inline-block hover:bg-neutral-100 cursor-pointer py-2 px-3 rounded-md shadow-2xl text-black border">
                      {issueType}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>불량 유형</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => setIssueType("전원 불가")}
                    >
                      전원 불가
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setIssueType("충전 불가")}
                    >
                      충전 불가
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setIssueType("화면 깨짐")}
                    >
                      화면 깨짐
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setIssueType("작동 이상")}
                    >
                      작동 이상
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIssueType("기타")}>
                      기타
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* 불량 사항 텍스트 */}
                <Textarea className="text-black" />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={() => {
                  navigate("/lending-state");
                  toast("불량 신청이 완료되었습니다.");
                }}
              >
                신청
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Table className="text-center">
          <TableHeader className=" border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-white text-center">분류</TableHead>
              <TableHead className="text-white text-center">기기명</TableHead>
              <TableHead className="text-white text-center">코드번호</TableHead>
              <TableHead className="text-white text-center">
                대여 학기
              </TableHead>
              <TableHead className="text-white text-center">상태</TableHead>
              <TableHead className="text-white text-center">QR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="hover:bg-[#060a0c]">
            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>기자재</TableCell>
              <TableCell>iPad Air 3</TableCell>
              <TableCell>A20342</TableCell>
              <TableCell>2025-1</TableCell>
              <TableCell>대여중</TableCell>
              <TableCell>
                <QrModal
                  title="iPad Air 3 - QR 인증"
                  value="https://example.com/check-in?otp=123456"
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>실습키트</TableCell>
              <TableCell>Cortex-M3</TableCell>
              <TableCell>CS123891</TableCell>
              <TableCell>2024-2</TableCell>
              <TableCell>미반납</TableCell>
              <TableCell>
                <QrModal
                  title="Cortex-M3 - QR 인증"
                  value="https://example.com/check-in?otp=abcde"
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>실습키트</TableCell>
              <TableCell>아두이노</TableCell>
              <TableCell>CS1272</TableCell>
              <TableCell>2022-2</TableCell>
              <TableCell>반납됨</TableCell>
              <TableCell>
                <QrModal
                  title="아두이노 - QR 인증"
                  value="https://example.com/check-in?otp=999999"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default LendState;
