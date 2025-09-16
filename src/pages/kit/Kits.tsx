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

const Kits = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#060a0c] w-screen h-full px-8 text-white">
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
                <TableCell></TableCell>
                <TableCell>Cortex-M3</TableCell>
                <TableCell>마이크로프로세서 및 실습</TableCell>
                <TableCell>임승호</TableCell>
                <TableCell>5</TableCell>
                <TableCell>12</TableCell>
                <TableCell>3</TableCell>
                <TableCell className="font-bold">20</TableCell>
              </TableRow>
              <TableRow onClick={() => navigate("/admin/kits/2")}>
                <TableCell></TableCell>
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
