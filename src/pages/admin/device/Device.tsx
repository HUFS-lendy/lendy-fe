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
const Device = () => {
  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white">
      {/* 브래드크럼 */}
      <div className="pt-20">
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
        <div className="mt-4">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
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
                <TableCell>A20342</TableCell>
                <TableCell>-</TableCell>
                <TableCell>대여중</TableCell>
                <TableCell>이서연</TableCell>
                <TableCell>202202465</TableCell>
                <TableCell>010-1234-5678</TableCell>
                <TableCell>lsy@hufs.ac.kr</TableCell>
              </TableRow>
              <TableRow>
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
                <TableCell>010-1234-5678</TableCell>
                <TableCell>jbj@hufs.ac.kr</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>A20344</TableCell>
                <TableCell>-</TableCell>
                <TableCell>미반납</TableCell>
                <TableCell>남하원</TableCell>
                <TableCell>202412345</TableCell>
                <TableCell>010-1234-5678</TableCell>
                <TableCell>nhw@hufs.ac.kr</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Device;
