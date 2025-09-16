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
const Kit = () => {
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
              <TableHead className="text-white text-center">대여일</TableHead>
              <TableHead className="text-white text-center">반납일</TableHead>
              <TableHead className="text-white text-center">대여자</TableHead>
              <TableHead className="text-white text-center">학번</TableHead>
              <TableHead className="text-white text-center">연락처</TableHead>
              <TableHead className="text-white text-center">메일</TableHead>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>P20342</TableCell>
                <TableCell>불량</TableCell>
                <TableCell>대여중</TableCell>
                <TableCell>2025-03-15</TableCell>
                <TableCell>-</TableCell>
                <TableCell>이서연</TableCell>
                <TableCell>202202465</TableCell>
                <TableCell>010-1234-5678</TableCell>
                <TableCell>lsy@hufs.ac.kr</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>P20343</TableCell>
                <TableCell>-</TableCell>
                <TableCell>반납 완료</TableCell>
                <TableCell>2025-03-15</TableCell>
                <TableCell>2025-06-20</TableCell>
                <TableCell>정병주</TableCell>
                <TableCell>202212345</TableCell>
                <TableCell>010-1234-5678</TableCell>
                <TableCell>jbj@hufs.ac.kr</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>P20344</TableCell>
                <TableCell>-</TableCell>
                <TableCell>미반납</TableCell>
                <TableCell>2025-03-15</TableCell>
                <TableCell>-</TableCell>
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

export default Kit;
