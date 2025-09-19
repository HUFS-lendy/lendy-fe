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
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../components/ui/popover";
import { Textarea } from "../../../components/ui/textarea";
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
import { Checkbox } from "../../../components/ui/checkbox";
import { DeviceStateCombobox } from "../../../components/ui/DeviceStateCombobox";
import { toast } from "sonner";
import { usePhoneCopy } from "../../../hooks/usePhoneCopy";

const Device = () => {
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
                href="/admin/devices"
              >
                기기 현황
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
        <div className="font-bold text-white text-3xl pb-8">
          아이패드 Air 상세 현황
        </div>
        <div className="flex space-x-4 justify-end">
          {/* 기자재 추가 버튼 */}
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="hover:bg-neutral-800 cursor-pointer border border-neutral-400 text-neutral-200 text-sm px-3 py-1 rounded-sm">
                  수정
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    2025-1 iPad Air 3 내용 수정
                  </AlertDialogTitle>
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
                        <TableCell className="text-left px-6">태블릿</TableCell>
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
                      toast("해당 기기의 대여 상태가 수정되었습니다.")
                    }
                    className=" hover:bg-neutral-700 font-bold cursor-pointer"
                  >
                    수정
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
                  아이패드 Air(A20342) 를 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  기자재를 삭제하면 다시 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => toast("해당 기기가 삭제되었습니다.")}
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
                <TableCell>A20342</TableCell>
                <TableCell>-</TableCell>
                <TableCell>대여중</TableCell>
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
                <TableCell>A20343</TableCell>
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
                <TableCell>반납 완료</TableCell>
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
                <TableCell>A20344</TableCell>
                <TableCell>-</TableCell>
                <TableCell>미반납</TableCell>
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

export default Device;
