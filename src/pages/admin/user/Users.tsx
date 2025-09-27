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
import { Checkbox } from "../../../components/ui/checkbox";
import { Search } from "lucide-react";
import { RoleCombobox } from "../../../components/ui/RoleCombobox";
import { StateCombobox } from "../../../components/ui/StateCombobox";
import { toast } from "sonner";
import { Label } from "../../../components/ui/label";

const Users = () => {
  const navigte = useNavigate();

  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white">
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
                사용자 관리
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 제목 */}
      <div className="pt-8 pb-4">
        <div className="font-bold text-white text-3xl pb-4">사용자 관리</div>
      </div>
      {/* 검색창 & 수정 버튼 */}
      <div className="flex justify-between items-center pr-2">
        {/* 검색창 */}
        <div className="relative w-2/5 md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <Input
            placeholder="학번 또는 이름을 입력해주세요."
            className="border-neutral-400 pl-10 text-sm"
          />
        </div>
        <div className="flex space-x-2">
          {/* 수정 버튼 */}
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="hover:bg-neutral-800 cursor-pointer border border-neutral-400 text-neutral-200 text-sm px-3 py-1 rounded-sm">
                  수정
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>#1 이서연</AlertDialogTitle>
                  <AlertDialogDescription>
                    사용자 정보를 수정해보세요.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {/* 수정 모달 테이블 */}
                <div>
                  <Table className="text-center border border-neutral-200">
                    <TableBody>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          아이디
                        </TableCell>
                        <TableCell className="text-left px-6">1</TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          이름
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input className="text-sm" value="이서연" />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          학번
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input className="text-sm" value="202202465" />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          권한
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <RoleCombobox />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          상태
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <StateCombobox />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          이메일
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input
                            className="text-sm"
                            value="lsy0476@hufs.ac.kr"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          연락처
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input className="text-sm" value="010-2728-0476" />
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
                      toast("해당 사용자의 정보가 수정되었습니다.")
                    }
                    className=" hover:bg-neutral-700 font-bold cursor-pointer"
                  >
                    수정
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {/* 삭제 버튼 */}
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300">
                  삭제
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    #1 이서연을 삭제하시겠습니까?
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="cursor-pointer">
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => toast("해당 사용자가 삭제되었습니다.")}
                    className="bg-red-600 hover:bg-red-500 font-bold cursor-pointer"
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      {/* 권한 체크박스 */}
      <div className="flex items-center space-x-4 py-4">
        <Label>
          <Checkbox
            id="toggle-2"
            defaultChecked
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white dark:data-[state=checked]:border-neutral-700 dark:data-[state=checked]:bg-neutral-700"
          />
          <p className="text-sm">관리자</p>
        </Label>
        <Label>
          <Checkbox
            id="toggle-2"
            defaultChecked
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white dark:data-[state=checked]:border-neutral-700 dark:data-[state=checked]:bg-neutral-700"
          />
          <p className="text-sm">사용자</p>
        </Label>
        <Label>
          <Checkbox
            id="toggle-2"
            defaultChecked
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white dark:data-[state=checked]:border-neutral-700 dark:data-[state=checked]:bg-neutral-700"
          />
          <p className="text-sm">미반납자</p>
        </Label>
      </div>

      {/* 사용자 테이블 */}
      <div className="mt-4">
        <Table className="text-white text-center border border-neutral-700">
          <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableHead></TableHead>
            <TableHead className="text-white text-center">ID</TableHead>
            <TableHead className="text-white text-center">이름</TableHead>
            <TableHead className="text-white text-center">학번</TableHead>
            <TableHead className="text-white text-center">권한</TableHead>
            <TableHead className="text-white text-center">상태</TableHead>
            <TableHead className="text-white text-center">이메일</TableHead>
            <TableHead className="text-white text-center">연락처</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow
              className="cursor-pointer"
              onClick={() => navigte("/admin/users/1")}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </TableCell>
              <TableCell>1</TableCell>
              <TableCell>이서연</TableCell>
              <TableCell>202202465</TableCell>
              <TableCell>관리자</TableCell>
              <TableCell>ACTIVE</TableCell>
              <TableCell>lsy@hufs.ac.kr</TableCell>
              <TableCell>010-1234-5678</TableCell>
            </TableRow>
            <TableRow
              className="cursor-pointer"
              onClick={() => navigte("/admin/users/1")}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </TableCell>
              <TableCell>2</TableCell>
              <TableCell>남하원</TableCell>
              <TableCell>202202465</TableCell>
              <TableCell>사용자</TableCell>
              <TableCell>SUSPENDED</TableCell>
              <TableCell>nhw@hufs.ac.kr</TableCell>
              <TableCell>010-1234-5678</TableCell>
            </TableRow>
            <TableRow
              className="cursor-pointer"
              onClick={() => navigte("/admin/users/1")}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </TableCell>
              <TableCell>3</TableCell>
              <TableCell>정병주</TableCell>
              <TableCell>202202465</TableCell>
              <TableCell>관리자</TableCell>
              <TableCell>BANNED</TableCell>
              <TableCell>jbj@hufs.ac.kr</TableCell>
              <TableCell>010-1234-5678</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
