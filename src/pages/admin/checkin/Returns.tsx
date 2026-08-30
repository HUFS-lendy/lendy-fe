import { useEffect, useMemo, useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAdminReturns, useReturnReservation } from "../../../api/adminRental.api";

const RETURNS_PAGE_SIZE = 20;
const MAX_PAGE_BUTTONS = 5;

const Returns = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data,
    isLoading,
    isError,
  } = useAdminReturns({
    keyword,
    page: currentPage,
    size: RETURNS_PAGE_SIZE,
  });

  const { mutate: returnRental, isPending: isReturning } = useReturnReservation();

  const rentals = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) return [];

    if (totalPages <= MAX_PAGE_BUTTONS) {
      return Array.from({ length: totalPages }, (_, index) => index);
    }

    const half = Math.floor(MAX_PAGE_BUTTONS / 2);
    let startPage = currentPage - half;
    let endPage = currentPage + half;

    if (startPage < 0) {
      startPage = 0;
      endPage = MAX_PAGE_BUTTONS - 1;
    }

    if (endPage >= totalPages) {
      endPage = totalPages - 1;
      startPage = totalPages - MAX_PAGE_BUTTONS;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
    setSelectedRentalId(null);
  };

  const selectedRental =
    rentals.find((rental: { rentalId: number }) => rental.rentalId === selectedRentalId) ?? null;

  const handleSubmitReturn = () => {
    if (!selectedRental) {
      toast("반납 처리할 항목을 선택해주세요.");
      return;
    }

    returnRental(
      { rentalId: selectedRental.rentalId },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "기자재가 반납 처리되었습니다.");
          setSelectedRentalId(null);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "반납 처리에 실패했습니다.",
          );
        },
      },
    );
  };

  const isOverdue = (dueAt?: string | null) => {
    if (!dueAt) return false;
    return new Date(dueAt).getTime() < Date.now();
  };

  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white">
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
              <BreadcrumbPage className="text-white">반납 처리</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8 pb-4">
        <div className="font-bold text-white text-3xl pb-4">반납 처리</div>
      </div>

      <div className="flex justify-between items-center pr-2">
        <div className="relative w-3/5 md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3 h-3 md:w-5 md:h-5" />
          <Input
            placeholder="시리얼번호, 학번 또는 이름을 입력해주세요."
            className="border-neutral-400 pl-8 md:pl-10 text-sm"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(0);
              setSelectedRentalId(null);
            }}
          />
        </div>

        <div className="flex space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={!selectedRental}
                className={`border text-sm px-3 py-1 rounded-sm ${
                  selectedRental
                    ? "hover:bg-neutral-800 cursor-pointer border-neutral-400 text-neutral-200"
                    : "cursor-not-allowed border-neutral-700 text-neutral-600"
                }`}
              >
                반납 처리
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedRental
                    ? `${selectedRental.serial} 반납 처리`
                    : "반납 처리"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  선택한 기자재를 반납 처리합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div>
                <Table className="text-center border border-neutral-200">
                  <TableBody>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        시리얼번호
                      </TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {selectedRental?.serial}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        기자재명
                      </TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {selectedRental?.modelName}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        대여자
                      </TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {selectedRental?.username}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        학번
                      </TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {selectedRental?.studentId}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        반납기한
                      </TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {selectedRental?.dueAt
                          ? format(
                              new Date(selectedRental.dueAt),
                              "yyyy년 MM월 dd일 HH:mm",
                            )
                          : "-"}
                      </TableCell>
                    </TableRow>
                    {selectedRental?.specialRental && (
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          특별 대여 사유
                        </TableCell>
                        <TableCell className="text-left px-6 text-black">
                          {selectedRental.specialReason || "-"}
                          <span className="ml-2 text-neutral-500">
                            · 승인 {selectedRental.specialApprovedBy || "관리자"}
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="cursor-pointer">
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-black font-bold"
                  disabled={!selectedRental || isReturning}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmitReturn();
                  }}
                >
                  {isReturning ? "처리 중..." : "반납"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-4">
        <Table className="text-white text-center border border-neutral-700">
          <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-white text-center">순번</TableHead>
              <TableHead className="text-white text-center">시리얼번호</TableHead>
              <TableHead className="text-white text-center">기자재명</TableHead>
              <TableHead className="text-white text-center">대여자</TableHead>
              <TableHead className="text-white text-center">학번</TableHead>
              <TableHead className="text-white text-center">구분</TableHead>
              <TableHead className="text-white text-center">대여일</TableHead>
              <TableHead className="text-white text-center">반납기한</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="py-6 text-center">
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-6 text-center text-red-300"
                >
                  반납 대상을 불러오지 못했습니다.
                </TableCell>
              </TableRow>
            ) : rentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-6 text-center">
                  조회된 대여 중 항목이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              rentals.map((rental, index) => (
                  <TableRow
                    key={rental.rentalId}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedRentalId((prev) =>
                        prev === rental.rentalId ? null : rental.rentalId,
                      )
                    }
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRentalId === rental.rentalId}
                        onCheckedChange={(checked) =>
                          setSelectedRentalId(checked ? rental.rentalId : null)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {currentPage * RETURNS_PAGE_SIZE + index + 1}
                    </TableCell>
                    <TableCell>{rental.serial}</TableCell>
                    <TableCell>{rental.modelName}</TableCell>
                    <TableCell>{rental.username}</TableCell>
                    <TableCell>{rental.studentId}</TableCell>
                    <TableCell>
                      {rental.specialRental ? (
                        <span className="rounded border border-white/30 px-2 py-1 text-xs">특별 대여</span>
                      ) : "일반"}
                    </TableCell>
                    <TableCell>
                      {rental.rentedAt
                        ? format(
                            new Date(rental.rentedAt),
                            "yyyy년 MM월 dd일 HH:mm",
                          )
                        : "-"}
                    </TableCell>
                    <TableCell
                      className={
                        isOverdue(rental.dueAt) ? "text-red-300 font-bold" : ""
                      }
                    >
                      {rental.dueAt
                        ? format(new Date(rental.dueAt), "yyyy년 MM월 dd일 HH:mm")
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 ? (
          <div className="my-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                    className={`border bg-black text-white hover:bg-neutral-800 hover:text-white ${
                      currentPage === 0
                        ? "pointer-events-none opacity-50 border-neutral-700"
                        : "cursor-pointer border-none"
                    }`}
                  />
                </PaginationItem>

                {pageNumbers.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNumber);
                      }}
                      className={`cursor-pointer border text-white hover:bg-neutral-800 hover:text-white ${
                        pageNumber === currentPage
                          ? "bg-black border-white text-white"
                          : "bg-transparent border-neutral-700 text-white"
                      }`}
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
                      handlePageChange(currentPage + 1);
                    }}
                    className={`border bg-black text-white hover:bg-neutral-800 hover:text-white ${
                      currentPage >= totalPages - 1
                        ? "pointer-events-none opacity-50 border-neutral-700"
                        : "cursor-pointer border-none"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Returns;
