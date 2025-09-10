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

const LendState = () => {
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
        <Table>
          <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableRow>
              <TableHead className="text-white">분류</TableHead>
              <TableHead className="text-white">기기명</TableHead>
              <TableHead className="text-white">코드번호</TableHead>
              <TableHead className="text-white">대여 학기</TableHead>
              <TableHead className="text-white">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="hover:bg-[#060a0c]">
            <TableRow>
              <TableCell>기자재</TableCell>
              <TableCell>iPad Air 3</TableCell>
              <TableCell>A20342</TableCell>
              <TableCell>2025-1</TableCell>
              <TableCell>대여중</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>실습키트</TableCell>
              <TableCell>Cortex-M3</TableCell>
              <TableCell>CS123891</TableCell>
              <TableCell>2024-2</TableCell>
              <TableCell>미반납</TableCell>
            </TableRow>
            <TableRow>
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
export default LendState;
