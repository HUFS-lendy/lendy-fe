import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
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
import { toast } from "sonner";
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
import { useCreateRental } from "../../../api/adminRental.api";
import { format, compareDesc } from "date-fns";
import { Checkbox } from "../../../components/ui/checkbox";
import { type CheckinItem } from "../../../type/adminCheckin.type";

const CheckIn = () => {
  const [keyword, setKeyword] = useState("");
  const [page] = useState(0);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const size = 20;

  const { data, isLoading, isError } = useCheckinList(keyword, page, size);
  const { mutate: createRental, isPending } = useCreateRental();

  const checkinList = data?.content ?? [];

  const selectedReservation =
    checkinList.find(
      (reservation) => reservation.reservationId === selectedReservationId,
    ) ?? null;

  const handleSelectReservation = (reservation: CheckinItem) => {
    const isSameSelected =
      selectedReservationId === reservation.reservationId &&
      selectedItemId === reservation.itemId;

    if (isSameSelected) {
      setSelectedReservationId(null);
      setSelectedItemId(null);
      return;
    }

    setSelectedReservationId(reservation.reservationId);
    setSelectedItemId(reservation.itemId);
  };

  const handleCreateRental = () => {
    if (!selectedReservationId || !selectedItemId) {
      toast.error("대여 전환할 예약을 선택해주세요.");
      return;
    }

    createRental(
      {
        reservationId: selectedReservationId,
        itemId: selectedItemId,
      },
      {
        onSuccess: () => {
          toast.success("대여 전환이 완료되었습니다.");
          setSelectedReservationId(null);
          setSelectedItemId(null);
        },
        onError: () => {
          toast.error("대여 전환 중 오류가 발생했습니다.");
        },
      },
    );
  };

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

      <div className="flex items-center justify-between">
        <div className="relative w-3/5 md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3 h-3 md:w-5 md:h-5" />
          <Input
            placeholder="학번 또는 이름을 입력해주세요."
            className="border-neutral-400 pl-8 md:pl-10 text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm"
              //   disabled={!selectedReservationId || !selectedItemId}
              disabled={!selectedReservationId}
            >
              대여 전환
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {selectedReservation
                  ? `${selectedReservation.modelName} (${selectedReservation.itemSerial}) 을 대여 전환하시겠습니까?`
                  : "선택한 예약을 대여 전환하시겠습니까?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                예약 상태의 기자재를 실제 대여 상태로 전환합니다.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCreateRental}
                disabled={isPending}
                className="bg-red-600 hover:bg-red-500 font-bold"
              >
                {isPending ? "전환 중..." : "전환"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-4">
        <Table className="text-white text-center border border-neutral-700">
          <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableRow>
              <TableHead></TableHead>
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
              [...checkinList]
                .sort((a, b) =>
                  compareDesc(new Date(a.reservedAt), new Date(b.reservedAt)),
                )
                .map((reservation) => {
                  return (
                    <TableRow key={reservation.reservationId}>
                      <TableCell>
                        <Checkbox
                          onCheckedChange={() =>
                            handleSelectReservation(reservation)
                          }
                        />
                      </TableCell>
                      <TableCell>{reservation.username}</TableCell>
                      <TableCell>{reservation.studentId}</TableCell>
                      <TableCell>{reservation.category}</TableCell>
                      <TableCell>{reservation.modelName}</TableCell>
                      <TableCell>{reservation.itemSerial}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell>{reservation.semester}</TableCell>
                      <TableCell>
                        {format(
                          new Date(reservation.reservedAt),
                          "yyyy년 MM월 dd일 HH시 mm분",
                        )}
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(reservation.expiresAt),
                          "yyyy년 MM월 dd일 HH시 mm분",
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CheckIn;
