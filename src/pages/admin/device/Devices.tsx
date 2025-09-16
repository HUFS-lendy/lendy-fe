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
const Devices = () => {
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
                href="/admin"
              >
                홈
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">기기 현황</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">기자재 현황</div>
        <div className="mt-4">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableHead></TableHead>
              <TableHead className="text-white text-center">분류</TableHead>
              <TableHead className="text-white text-center">기자재명</TableHead>
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
              <TableRow onClick={() => navigate("/admin/devices/1")}>
                <TableCell></TableCell>
                <TableCell>태블릿</TableCell>
                <TableCell>아이패드 Air</TableCell>
                <TableCell>7</TableCell>
                <TableCell>1</TableCell>
                <TableCell>2</TableCell>
                <TableCell className="font-bold">10</TableCell>
              </TableRow>
              <TableRow onClick={() => navigate("/admin/devices/1")}>
                <TableCell></TableCell>
                <TableCell>노트북</TableCell>
                <TableCell>삼성 노트북</TableCell>
                <TableCell>6</TableCell>
                <TableCell>2</TableCell>
                <TableCell>2</TableCell>
                <TableCell className="font-bold">10</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Devices;
