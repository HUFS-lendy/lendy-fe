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
import { DeviceCategoryCombobox } from "../../../components/ui/DeviceCategory";
import { Checkbox } from "../../../components/ui/checkbox";
import { DeviceStateCombobox } from "../../../components/ui/DeviceStateCombobox";
import { toast } from "sonner";

const User = () => {
  return (
    <div className="w-screen px-8 text-white">
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
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/admin/users"
              >
                사용자 관리
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                이서연의 대여 기록
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 제목 */}
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-4">이서연</div>
      </div>
      <div className="flex space-x-4 justify-end">
        {/* 대여 내용 수정 버튼 */}
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="hover:bg-neutral-800 cursor-pointer border border-neutral-400 text-neutral-200 text-sm px-3 py-1 rounded-sm">
                수정
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>2025-1 iPad Air 3 내용 수정</AlertDialogTitle>
                <AlertDialogDescription>
                  기기 대여 내용을 수정해보세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              {/* 수정 모달 테이블 */}
              <div>
                <Table className="text-center border border-neutral-200">
                  <TableBody>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        대여 ID
                      </TableCell>
                      <TableCell className="text-left px-6">1</TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        분류
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <DeviceCategoryCombobox />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        기기명
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <Input
                          className="text-sm"
                          readOnly
                          value="iPad Air 3"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        코드번호
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <Input className="text-sm" value="A20342" />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        이메일
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <Input
                          className="text-sm"
                          value="2025-1"
                          placeholder="yyyy-1"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        대여 상태
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <DeviceStateCombobox />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="cursor-pointer">
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    toast("사용자의 해당 대여 내용이 수정되었습니다.")
                  }
                  className=" hover:bg-neutral-700 font-bold cursor-pointer"
                >
                  수정
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        {/* 대여 기록 삭제 버튼 */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300">
              삭제
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="break-keep">
                2025-1 아이패드 Air(A20342) 대여 기록을 삭제하시겠습니까?
              </AlertDialogTitle>
              <AlertDialogDescription>
                대여 기록은 삭제하면 다시 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  toast("사용자의 해당 대여 내용이 삭제되었습니다.")
                }
                className="bg-red-600 hover:bg-red-500 font-bold cursor-pointer"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {/* 사용자 테이블 */}
      <div className="mt-4">
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
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default User;
