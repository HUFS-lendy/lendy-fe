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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../components/ui/popover";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { toast } from "sonner";
import { usePhoneCopy } from "../../../hooks/usePhoneCopy";

const Kit = () => {
  const copyPhone = usePhoneCopy();

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
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/admin/kits"
              >
                실습키트 현황
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">상세 현황</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-4">
          Cortex-M3 상세 현황
        </div>
        <div className="pb-6 text-sm text-neutral-400">
          사용 수업 : 마이크로프로세서 및 실습 (임승호)
        </div>
        <div className="flex space-x-4 justify-end">
          {/* 키트 추가 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                추가
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cortex-M3 키트 추가</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4">
                {/* todo: 여러개 엔터로 입력되게 */}
                <div>
                  <Label className="pb-2">코드 번호</Label>
                  <Input />
                </div>
              </div>
              {/* todo: 추가에서 수정으로 */}
              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => toast("실습키트가 추가되었습니다.")}
                >
                  추가
                </AlertDialogAction>
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
                <AlertDialogAction
                  onClick={() => toast("해당 실습키트가 삭제되었습니다.")}
                  className="bg-red-600 hover:bg-red-500 font-bold"
                >
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
              <TableHead className="text-white text-center">
                코드 번호
              </TableHead>
              <TableHead className="text-white text-center">
                대여 상태
              </TableHead>
              <TableHead className="text-white text-center">
                반납 상태
              </TableHead>
              <TableHead className="text-white text-center">대여일</TableHead>
              <TableHead className="text-white text-center">반납일</TableHead>
              <TableHead className="text-white text-center">대여자</TableHead>
              <TableHead className="text-white text-center">학번</TableHead>
              <TableHead className="text-white text-center">연락처</TableHead>
              <TableHead className="text-white text-center">메일</TableHead>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>P20342</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="hover:underline cursor-pointer">불량</div>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="leading-none font-medium">
                            불량 상세 설명
                          </h4>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 items-center gap-4">
                            <Label>불량 종류</Label>
                            <Input
                              id="type"
                              defaultValue="고장"
                              readOnly
                              className="col-span-2 h-8"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <Label>설명</Label>
                            <Textarea
                              id="maxWidth"
                              defaultValue="홈 버튼이 눌리지 않습니다."
                              readOnly
                              className="col-span-2 h-8"
                            />
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>대여중</TableCell>
                <TableCell>2025-03-15</TableCell>
                <TableCell>-</TableCell>
                <TableCell>이서연</TableCell>
                <TableCell>202202465</TableCell>
                <TableCell
                  className="cursor-pointer hover:underline"
                  onClick={() => copyPhone("010-1234-5678")}
                >
                  010-1234-5678
                </TableCell>
                <TableCell>
                  <a
                    href="mailto:lsy@hufs.ac.kr"
                    className="hover:underline cursor-pointer"
                    title="메일 작성하기"
                  >
                    lsy@hufs.ac.kr
                  </a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>P20343</TableCell>
                <TableCell>-</TableCell>
                <TableCell>반납 완료</TableCell>
                <TableCell>2025-03-15</TableCell>
                <TableCell>2025-06-20</TableCell>
                <TableCell>정병주</TableCell>
                <TableCell>202212345</TableCell>
                <TableCell
                  className="cursor-pointer hover:underline"
                  onClick={() => copyPhone("010-1234-5678")}
                >
                  010-1234-5678
                </TableCell>
                <TableCell>
                  <a
                    href="mailto:lsy@hufs.ac.kr"
                    className="hover:underline cursor-pointer"
                    title="메일 작성하기"
                  >
                    jbj@hufs.ac.kr
                  </a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>P20344</TableCell>
                <TableCell>-</TableCell>
                <TableCell>미반납</TableCell>
                <TableCell>2025-03-15</TableCell>
                <TableCell>-</TableCell>
                <TableCell>남하원</TableCell>
                <TableCell>202412345</TableCell>
                <TableCell
                  className="cursor-pointer hover:underline"
                  onClick={() => copyPhone("010-1234-5678")}
                >
                  010-1234-5678
                </TableCell>
                <TableCell>
                  <a
                    href="mailto:lsy@hufs.ac.kr"
                    className="hover:underline cursor-pointer"
                    title="메일 작성하기"
                  >
                    nhw@hufs.ac.kr
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Kit;
