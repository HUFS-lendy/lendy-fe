import { useEffect, useMemo, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";
import { toast } from "sonner";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  useDeleteReservation,
  useMyReservations,
} from "../api/reservationUser.api";
import { useMe, useMyRentals } from "../api/user.api";
import { useModelsByIds } from "../api/modelUser.api";

const PAGE_SIZE = 10;

const getReservationStatusText = (status: string) => {
  switch (status) {
    case "RESERVED":
      return "예약중";
    case "CANCELLED":
      return "취소됨";
    case "EXPIRED":
      return "만료됨";
    default:
      return status;
  }
};

const getRentalStatusText = (status: string) => {
  switch (status) {
    case "RENTING":
      return "대여중";
    case "RETURNED":
      return "반납완료";
    case "OVERDUE":
      return "미반납";
    default:
      return status;
  }
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return format(new Date(date), "yyyy년 MM월 dd일", { locale: ko });
};

const LendState = () => {
  const [selectedTab, setSelectedTab] = useState("예약");
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [reservationCurrentPage, setReservationCurrentPage] = useState(0);
  const [rentalCurrentPage, setRentalCurrentPage] = useState(0);

  const {
    data: myreservation,
    isLoading,
    isError,
    error,
  } = useMyReservations(reservationCurrentPage, PAGE_SIZE);
  const {
    data: myRentals,
    isLoading: isRentalLoading,
    isError: isRentalError,
    error: rentalError,
  } = useMyRentals({ page: rentalCurrentPage, size: PAGE_SIZE });
  const { data: myInfo } = useMe();
  const { mutate: deleteReservation, isPending: isDeletingReservation } =
    useDeleteReservation();

  const reservationList = useMemo(() => {
    return (
      myreservation?.content?.filter((item) => item.status !== "CONVERTED") ??
      []
    );
  }, [myreservation]);

  const rentalList = useMemo(() => {
    return myRentals?.content ?? [];
  }, [myRentals]);

  const modelIds = useMemo(() => {
    const ids = reservationList
      .map((item) => item.modelId)
      .filter((id): id is number => typeof id === "number");
    return [...new Set(ids)];
  }, [reservationList]);

  const modelQueries = useModelsByIds(modelIds);

  const modelNameMap = useMemo(() => {
    return modelQueries.reduce<Record<number, string>>((acc, query, index) => {
      const modelId = modelIds[index];
      if (modelId && query.data?.name) acc[modelId] = query.data.name;
      return acc;
    }, {});
  }, [modelIds, modelQueries]);

  const reservationTotalPages = myreservation?.totalPages ?? 0;
  const rentalTotalPages = myRentals?.totalPages ?? 0;

  const reservationPageNumbers = useMemo(() => {
    return Array.from({ length: reservationTotalPages }, (_, index) => index);
  }, [reservationTotalPages]);

  const rentalPageNumbers = useMemo(() => {
    return Array.from({ length: rentalTotalPages }, (_, index) => index);
  }, [rentalTotalPages]);

  useEffect(() => {
    if (
      reservationCurrentPage >= reservationTotalPages &&
      reservationTotalPages > 0
    )
      setReservationCurrentPage(reservationTotalPages - 1);
  }, [reservationCurrentPage, reservationTotalPages]);

  useEffect(() => {
    if (rentalCurrentPage >= rentalTotalPages && rentalTotalPages > 0)
      setRentalCurrentPage(rentalTotalPages - 1);
  }, [rentalCurrentPage, rentalTotalPages]);

  const handleReservationPageChange = (page: number) => {
    if (page < 0 || page >= reservationTotalPages) return;
    setReservationCurrentPage(page);
    setSelectedReservationId(null);
  };

  const handleRentalPageChange = (page: number) => {
    if (page < 0 || page >= rentalTotalPages) return;
    setRentalCurrentPage(page);
  };

  const handleDeleteReservation = () => {
    if (!selectedReservationId) {
      toast.error("취소할 예약을 선택해주세요.");
      return;
    }

    const selectedReservation = reservationList.find(
      (item) => item.reservationId === selectedReservationId,
    );

    if (!selectedReservation) {
      toast.error("선택한 예약 정보를 찾을 수 없습니다.");
      return;
    }

    if (selectedReservation.status !== "RESERVED") {
      toast.error("예약중 상태만 취소할 수 있습니다.");
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

        <Tabs
          value={selectedTab}
          onValueChange={(value) => {
            setSelectedTab(value);
            setSelectedReservationId(null);
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-[#1e2427]">
              <TabsTrigger className="text-white bg-[#1e2427]" value="예약">
                예약
              </TabsTrigger>
              <TabsTrigger className="text-white bg-[#1e2427]" value="대여">
                대여
              </TabsTrigger>
            </TabsList>

            {selectedTab === "예약" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={!selectedReservationId || isDeletingReservation}
                    className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    예약 취소
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      선택한 예약을 취소하시겠습니까?
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
            )}
          </div>

          <TabsContent value="예약">
            <Table className="text-center">
              <TableHeader className="border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="text-white text-center">
                    예약 상태
                  </TableHead>
                  <TableHead className="text-white text-center">
                    기기명
                  </TableHead>
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
                      colSpan={5}
                      className="text-center text-gray-300 py-8"
                    >
                      불러오는 중...
                    </TableCell>
                  </TableRow>
                )}

                {isError && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-red-400 py-8"
                    >
                      조회 중 오류가 발생했습니다.
                      {error instanceof Error ? ` (${error.message})` : ""}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && reservationList.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-300 py-8"
                    >
                      예약 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading &&
                  !isError &&
                  reservationList.map((item) => (
                    <TableRow key={item.reservationId}>
                      <TableCell>
                        <Checkbox
                          className="border-neutral-400"
                          disabled={item.status !== "RESERVED"}
                          checked={selectedReservationId === item.reservationId}
                          onCheckedChange={(checked) =>
                            setSelectedReservationId(
                              checked === true ? item.reservationId : null,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {getReservationStatusText(item.status)}
                      </TableCell>
                      <TableCell>{modelNameMap[item.modelId] ?? "-"}</TableCell>
                      <TableCell>{formatDate(item.reservedAt)}</TableCell>
                      <TableCell>{formatDate(item.expiresAt)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {reservationTotalPages > 1 ? (
              <div className="my-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReservationPageChange(
                            reservationCurrentPage - 1,
                          );
                        }}
                        className={`border bg-black text-white hover:bg-neutral-800 hover:text-white ${reservationCurrentPage === 0 ? "pointer-events-none opacity-50 border-neutral-700" : "cursor-pointer border-none"}`}
                      />
                    </PaginationItem>

                    {reservationPageNumbers.map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === reservationCurrentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handleReservationPageChange(pageNumber);
                          }}
                          className={`cursor-pointer border text-white hover:bg-neutral-800 hover:text-white ${pageNumber === reservationCurrentPage ? "bg-black border-white text-white" : "bg-transparent border-neutral-700 text-white"}`}
                        >
                          {pageNumber + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReservationPageChange(
                            reservationCurrentPage + 1,
                          );
                        }}
                        className={`border bg-black text-white hover:bg-neutral-800 hover:text-white ${reservationCurrentPage >= reservationTotalPages - 1 ? "pointer-events-none opacity-50 border-neutral-700" : "cursor-pointer border-none"}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="대여">
            <Table className="text-center">
              <TableHeader className="border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
                <TableRow>
                  <TableHead className="text-white text-center">
                    대여 상태
                  </TableHead>
                  <TableHead className="text-white text-center">분류</TableHead>
                  <TableHead className="text-white text-center">
                    기기명
                  </TableHead>
                  <TableHead className="text-white text-center">
                    시리얼 번호
                  </TableHead>
                  <TableHead className="text-white text-center">학기</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="hover:bg-[#060a0c]">
                {isRentalLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-300 py-8"
                    >
                      불러오는 중...
                    </TableCell>
                  </TableRow>
                )}

                {isRentalError && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-red-400 py-8"
                    >
                      조회 중 오류가 발생했습니다.
                      {rentalError instanceof Error
                        ? ` (${rentalError.message})`
                        : ""}
                    </TableCell>
                  </TableRow>
                )}

                {!isRentalLoading &&
                  !isRentalError &&
                  rentalList.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-300 py-8"
                      >
                        대여 내역이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}

                {!isRentalLoading &&
                  !isRentalError &&
                  rentalList.map((item) => (
                    <TableRow key={item.rentalId}>
                      <TableCell>{getRentalStatusText(item.status)}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.modelName}</TableCell>
                      <TableCell>{item.itemSerial}</TableCell>
                      <TableCell>{item.semester}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {rentalTotalPages > 1 ? (
              <div className="my-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRentalPageChange(rentalCurrentPage - 1);
                        }}
                        className={`border bg-black text-white hover:bg-neutral-800 hover:text-white ${rentalCurrentPage === 0 ? "pointer-events-none opacity-50 border-neutral-700" : "cursor-pointer border-none"}`}
                      />
                    </PaginationItem>

                    {rentalPageNumbers.map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === rentalCurrentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handleRentalPageChange(pageNumber);
                          }}
                          className={`cursor-pointer border text-white hover:bg-neutral-800 hover:text-white ${pageNumber === rentalCurrentPage ? "bg-black border-white text-white" : "bg-transparent border-neutral-700 text-white"}`}
                        >
                          {pageNumber + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRentalPageChange(rentalCurrentPage + 1);
                        }}
                        className={`border bg-black text-white hover:bg-neutral-800 hover:text-white ${rentalCurrentPage >= rentalTotalPages - 1 ? "pointer-events-none opacity-50 border-neutral-700" : "cursor-pointer border-none"}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LendState;
