import { useMemo, useState } from "react";
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
import { Checkbox } from "../components/ui/checkbox";
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
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useDeleteReservation,
  useMyReservations,
} from "../api/reservationUser.api";
import { useMe } from "../api/user.api";
import { useModelsByIds } from "../api/modelUser.api";

// todo : 밖으로 빼기
const getReservationStatusText = (status: string) => {
  switch (status) {
    case "RESERVED":
      return "예약중";
    case "CONVERTED":
      return "대여중";
    case "CANCELLED":
      return "취소됨";
    case "EXPIRED":
      return "만료됨";
    default:
      return status;
  }
};

const LendState = () => {
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [page] = useState(0);
  const [size] = useState(20);

  const {
    data: myreservation,
    isLoading,
    isError,
    error,
  } = useMyReservations(page, size);
  const { data: myInfo } = useMe();

  const { mutate: deleteReservation, isPending: isDeletingReservation } =
    useDeleteReservation();

  const modelIds = useMemo(() => {
    const ids = myreservation?.content?.map((item) => item.modelId) ?? [];
    return [...new Set(ids)];
  }, [myreservation]);

  const modelQueries = useModelsByIds(modelIds);

  const modelNameMap = useMemo(() => {
    return modelQueries.reduce<Record<number, string>>((acc, query, index) => {
      const modelId = modelIds[index];
      if (modelId && query.data?.name) {
        acc[modelId] = query.data.name;
      }
      return acc;
    }, {});
  }, [modelIds, modelQueries]);

  // 예약 취소
  const handleDeleteReservation = () => {
    if (!selectedReservationId) {
      toast.error("취소할 예약을 선택해주세요.");
      return;
    }

    const selectedReservation = myreservation?.content?.find(
      (item) => item.reservationId === selectedReservationId,
    );

    if (!selectedReservation) {
      toast.error("선택한 예약 정보를 찾을 수 없습니다.");
      return;
    }

    if (selectedReservation.status === "CANCELLED") {
      toast.error("이미 취소된 상태입니다.");
      return;
    }

    deleteReservation(selectedReservationId, {
      onSuccess: () => {
        toast.success("예약이 취소되었습니다.");
        setSelectedReservationId(null);
      },
      onError: () => {
        toast.error("예약 취소에 실패했습니다.");
      },
    });
  };

  return (
    <div className="bg-[#060a0c] w-screen min-h-screen px-8">
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

      <div className="pt-8 text-white">
        <div className="font-bold text-3xl pb-8">
          {myInfo?.username}님의 대여 현황
        </div>

        <div className="flex justify-end space-x-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex justify-end mb-4">
                <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300">
                  예약 취소
                </div>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  선택한 얘약을 취소하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  예약을 취소하면 다시 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>돌아가기</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-500 font-bold"
                  onClick={handleDeleteReservation}
                  disabled={isDeletingReservation}
                >
                  {isDeletingReservation ? "취소 중..." : "취소"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <Table className="text-center">
          <TableHeader className="border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-white text-center">
                예약 상태
              </TableHead>
              <TableHead className="text-white text-center">기기명</TableHead>
              <TableHead className="text-white text-center">
                예약 시각
              </TableHead>
              <TableHead className="text-white text-center">
                만료 시각
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="hover:bg-[#060a0c]">
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-300 py-8"
                >
                  불러오는 중...
                </TableCell>
              </TableRow>
            )}

            {isError && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-red-400 py-8"
                >
                  조회 중 오류가 발생했습니다.
                  {error instanceof Error ? ` (${error.message})` : ""}
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && myreservation?.content?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-gray-300 py-8"
                >
                  대여/예약 내역이 없습니다.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              myreservation?.content?.map((item) => (
                <TableRow key={item.reservationId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReservationId === item.reservationId}
                      onCheckedChange={(checked) => {
                        setSelectedReservationId(
                          checked ? item.reservationId : null,
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>{getReservationStatusText(item.status)}</TableCell>
                  <TableCell>{modelNameMap[item.modelId] ?? "-"}</TableCell>
                  <TableCell>
                    {format(new Date(item.reservedAt), "yyyy년 MM월 dd일", {
                      locale: ko,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.expiresAt), "yyyy년 MM월 dd일", {
                      locale: ko,
                    })}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LendState;
