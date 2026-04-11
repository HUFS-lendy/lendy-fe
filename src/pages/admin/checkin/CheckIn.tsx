import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { useCheckinList } from "../../../api/adminCheckIn.api";
import { format } from "date-fns";

const CheckIn = () => {
  const [keyword, setKeyword] = useState("");
  const [page] = useState(0);
  const size = 20;

  const { data, isLoading, isError } = useCheckinList(keyword, page, size);

  const checkinList = data?.content ?? [];

  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white min-h-screen">
      <div className="pt-14">
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
              <BreadcrumbLink className="text-white hover:text-gray-100">
                대여 전환
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">대여 전환</div>
      </div>

      <div className="relative w-3/5 md:w-1/4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3 h-3 md:w-5 md:h-5" />
        <Input
          placeholder="학번 또는 이름을 입력해주세요."
          className="border-neutral-400 pl-8 md:pl-10 text-sm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <Table className="text-white text-center border border-neutral-700">
          <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableRow>
              <TableHead className="text-white text-center">이름</TableHead>
              <TableHead className="text-white text-center">학번</TableHead>
              <TableHead className="text-white text-center">종류</TableHead>
              <TableHead className="text-white text-center">기자재명</TableHead>
              <TableHead className="text-white text-center">
                기자재 번호
              </TableHead>
              <TableHead className="text-white text-center">상태</TableHead>
              <TableHead className="text-white text-center">
                대여 학기
              </TableHead>
              <TableHead className="text-white text-center">예약일</TableHead>
              <TableHead className="text-white text-center">반납일</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  로딩 중...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-6 text-red-400"
                >
                  데이터를 불러오는 중 오류가 발생했습니다.
                </TableCell>
              </TableRow>
            ) : checkinList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6">
                  조회된 예약이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              checkinList.map((reservation) => (
                <TableRow key={reservation.reservationId}>
                  <TableCell>{reservation.username}</TableCell>
                  <TableCell>{reservation.studentId}</TableCell>
                  <TableCell>{reservation.category}</TableCell>
                  <TableCell>{reservation.modelName}</TableCell>
                  <TableCell>{reservation.itemSerial}</TableCell>
                  <TableCell>{reservation.status}</TableCell>
                  <TableCell>{reservation.semester}</TableCell>
                  <TableCell>
                    {format(
                      reservation.reservedAt,
                      "yyyy년 MM월 dd일 HH시 mm분",
                    )}
                  </TableCell>
                  <TableCell>
                    {format(
                      reservation.expiresAt,
                      "yyyy년 MM월 dd일 HH시 mm분",
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CheckIn;
