import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Label } from "../components/ui/label";
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
import { useModels } from "../api/model.api";
import type { ModelItem } from "../type/model.type";
import { useDoReserve } from "../api/reservationUser.api";
import { clearReservationAdmission, getReservationAdmission } from "../lib/reservationAdmission";

const ITEMS_PER_PAGE = 10;
export type ReservationPreviewState = "selection" | "confirm" | "pledge" | "success" | "limit" | "failure";
const RESERVATION_SUCCESS_MESSAGE = "예약하신 기자재는 영업일 기준 3일 이내에 컴퓨터공학부 과사무실(공학관 206호)에서 수령해 주시기 바랍니다.\n기한 내 수령하지 않을 경우 예약은 자동으로 취소됩니다.\n예약 내용은 이메일로 전송되었습니다.";
const PREVIEW_MODELS: ModelItem[] = [
  { modelId: 9001, categoryId: 1, categoryName: "노트북", type: "EQUIPMENT", name: "GRAM", displayName: "노트북", subName: "LG gram", description: "수업 및 프로젝트용 노트북", visibleToUsers: true, courseName: null, availableQty: 12 },
  { modelId: 9002, categoryId: 2, categoryName: "태블릿", type: "EQUIPMENT", name: "IPAD", displayName: "태블릿 PC", subName: "iPad", description: "필기와 실습에 사용할 수 있는 태블릿", visibleToUsers: true, courseName: null, availableQty: 8 },
  { modelId: 9003, categoryId: 3, categoryName: "카메라", type: "EQUIPMENT", name: "CAMERA", displayName: "카메라", subName: "Sony Alpha", description: "촬영 및 콘텐츠 제작용 카메라", visibleToUsers: true, courseName: null, availableQty: 3 },
];

const Lend = ({ embedded = false, preview = false, previewState = "selection" }: { embedded?: boolean; preview?: boolean; previewState?: ReservationPreviewState }) => {
  const navigate = useNavigate();

  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [isPledgeAgreed, setIsPledgeAgreed] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [resultDialog, setResultDialog] = useState<{ type: "success" | "limit" | "error"; message: string } | null>(null);

  const { data: serverModels = [], isLoading: modelsLoading, isError: modelsError } = useModels();
  const { mutate: createReservation, isPending: isCreatingReservation } = useDoReserve();
  const previewServerModels = serverModels.filter((item) => item.type === "EQUIPMENT" && item.visibleToUsers);
  const models = preview ? (previewServerModels.length > 0 ? serverModels : PREVIEW_MODELS) : serverModels;
  const isLoading = preview ? modelsLoading && serverModels.length === 0 : modelsLoading;
  const isError = preview ? false : modelsError;

  const equipmentList = useMemo(() => {
    return models.filter(
      (item: ModelItem) => item.type === "EQUIPMENT" && item.visibleToUsers,
    );
  }, [models]);

  const totalPages = Math.ceil(equipmentList.length / ITEMS_PER_PAGE);

  const paginatedEquipmentList = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return equipmentList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [equipmentList, currentPage]);

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index);
  }, [totalPages]);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  const selectedEquipment =
    equipmentList.find((item: ModelItem) => item.modelId === selectedModelId) ??
    null;

  useEffect(() => {
    if (!preview) return;
    if (["confirm", "pledge", "success", "limit", "failure"].includes(previewState)) setSelectedModelId(equipmentList[0]?.modelId ?? PREVIEW_MODELS[0].modelId);
    setReservationDialogOpen(previewState === "confirm");
    setPledgeDialogOpen(previewState === "pledge");
    setIsPledgeAgreed(previewState === "success");
    setResultDialog(previewState === "success"
      ? { type: "success", message: RESERVATION_SUCCESS_MESSAGE }
      : previewState === "limit"
        ? { type: "limit", message: "한 학기에는 기자재를 1대만 예약하거나 대여할 수 있습니다." }
      : previewState === "failure"
        ? { type: "error", message: "선택한 기자재의 예약 가능 수량이 부족합니다." }
        : null);
  }, [equipmentList, preview, previewState]);

  const handleSelectModel = (modelId: number, checked: boolean) => {
    setSelectedModelId(checked ? modelId : null);
    setIsPledgeAgreed(false);
  };

  const handleReserveEquipment = () => {
    if (!selectedModelId) {
      toast("대여할 기자재를 선택해주세요.");
      return;
    }

    if (preview) {
      setReservationDialogOpen(false);
      setResultDialog({ type: "success", message: RESERVATION_SUCCESS_MESSAGE });
      return;
    }

    createReservation(
      { modelId: selectedModelId, admissionToken: getReservationAdmission() },
      {
        onSuccess: () => {
          clearReservationAdmission();
          setReservationDialogOpen(false);
          setResultDialog({ type: "success", message: RESERVATION_SUCCESS_MESSAGE });
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "대여 신청에 실패했습니다.";
          if (message.includes("입장권")) {
            clearReservationAdmission();
            navigate("/reservation", { replace: true });
          }
          setReservationDialogOpen(false);
          const isSemesterLimit = message.includes("동일 기자재 유형") || message.includes("1개만 예약/대여") || message.includes("한 학기에는");
          setResultDialog({ type: isSemesterLimit ? "limit" : "error", message });
        },
      },
    );
  };

  return (
    <div className={embedded ? "w-full" : "bg-[#060a0c] w-screen min-h-screen px-8"}>
      {!embedded && <div className="pt-20">
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
              <BreadcrumbPage className="text-white">대여 신청</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>}

      <div className={embedded ? "" : "pt-8"}>
        <div className="font-bold text-white text-3xl pb-8">
          기자재 대여 신청
        </div>

        <div className="mt-4">
          <AlertDialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
            <AlertDialogTrigger asChild>
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  disabled={!selectedModelId || isCreatingReservation}
                  className="bg-[#060a0c] hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm text-white border border-neutral-400 rounded-md px-3 py-1"
                  onClick={() => setReservationDialogOpen(true)}
                >
                  대여
                </button>
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="pb-4">
                  기자재를 대여하시겠습니까?
                </AlertDialogTitle>

                <AlertDialogDescription className="break-keep text-left">
                  {selectedEquipment && (
                    <div className="mb-4 text-black">
                      선택 항목:{" "}
                      <strong>
                        {selectedEquipment.displayName}
                        {selectedEquipment.subName
                          ? ` / ${selectedEquipment.subName}`
                          : ""}
                      </strong>
                    </div>
                  )}

                  <div className="text-black">
                    반납 기한은 해당 <span className="font-bold">학기 종강일</span>
                    까지이며, 기한 내 미반납 시 일주일 간 이메일로 경고 메일이
                    발송되며 대여 서비스 내 패널티가 부여될 수 있습니다.
                  </div>

                  <div className="mt-5 rounded-md border p-4">
                    <button
                      type="button"
                      className="rounded-md cursor-pointer border px-4 py-2 text-sm text-black hover:bg-neutral-100"
                      onClick={() => setPledgeDialogOpen(true)}
                    >
                      기자재 대여 서약 조항 보기
                    </button>

                    <div className="mt-3 text-sm">
                      {isPledgeAgreed ? (
                        <span className="text-green-600 font-medium">
                          서약 조항에 동의했습니다.
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          서약 조항 동의가 필요합니다.
                        </span>
                      )}
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleReserveEquipment();
                  }}
                  disabled={!isPledgeAgreed || isCreatingReservation}
                >
                  {isCreatingReservation ? "처리 중..." : "대여"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-white text-center">
                  기기 분류
                </TableHead>
                <TableHead className="text-white text-center">모델명</TableHead>
                <TableHead className="text-white text-center">
                  상세 안내
                </TableHead>
                <TableHead className="text-white text-center">
                  잔여 수량
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="cursor-pointer">
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    로딩 중...
                  </TableCell>
                </TableRow>
              )}

              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-red-400">
                    기자재 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !isError &&
                paginatedEquipmentList.map((item: ModelItem) => (
                  <TableRow
                    key={item.modelId}
                    onClick={() => {
                      setSelectedModelId((prev) =>
                        prev === item.modelId ? null : item.modelId,
                      );
                      setIsPledgeAgreed(false);
                    }}
                  >
                    <TableCell>
                      <Checkbox
                        className="border-neutral-400"
                        checked={selectedModelId === item.modelId}
                        onCheckedChange={(checked) =>
                          handleSelectModel(item.modelId, checked === true)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>{item.displayName}</TableCell>
                    <TableCell>{item.subName || "-"}</TableCell>
                    <TableCell className="max-w-[420px] text-left">
                      <div className="truncate">{item.description || "-"}</div>
                    </TableCell>
                    <TableCell>{item.availableQty}</TableCell>
                  </TableRow>
                ))}

              {!isLoading && !isError && equipmentList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    대여 가능한 기자재가 없습니다.
                  </TableCell>
                </TableRow>
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

        <AlertDialog open={pledgeDialogOpen} onOpenChange={setPledgeDialogOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>기자재 대여 서약 조항</AlertDialogTitle>
              <AlertDialogDescription className="text-left break-keep">
                아래 조항을 반드시 확인해주세요.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="max-h-[420px] overflow-y-auto rounded-md border p-4 text-sm leading-7 text-black">
              <p>
                1. 대여한 기자재는 본인만 사용하며 타인에게 양도하거나 대여하지
                않습니다.
              </p>
              <p>
                2. 대여 기자재의 분실, 파손, 침수, 임의 개조 시 관련 규정에 따라
                책임을 부담합니다.
              </p>
              <p>
                3. 반납 기한을 준수하며, 미반납 시 경고 메일 발송 및 패널티
                부여에 동의합니다.
              </p>
              <p>4. 방학 중 대여 및 연장이 제한될 수 있음을 확인합니다.</p>
              <p>5. 대리 제출 및 대리 수령이 불가함을 확인합니다.</p>
              <p>6. 학과 규정 및 기자재실 운영 지침을 준수합니다.</p>
              <p>7. 허위 정보로 대여 신청할 경우 대여가 취소될 수 있습니다.</p>
              <p>8. 기자재 반납 시 정상 동작 여부 확인 절차에 협조합니다.</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="pledge-dialog-agree"
                checked={isPledgeAgreed}
                onCheckedChange={(checked) =>
                  setIsPledgeAgreed(checked === true)
                }
              />
              <Label
                htmlFor="pledge-dialog-agree"
                className="text-sm text-black"
              >
                위 내용을 확인했고 동의합니다.
              </Label>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setPledgeDialogOpen(false)}
                className="cursor-pointer"
              >
                닫기
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={() => setPledgeDialogOpen(false)}
                disabled={!isPledgeAgreed}
              >
                확인
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={resultDialog !== null} onOpenChange={(open) => { if (!open) setResultDialog(null); }}>
          <AlertDialogContent className="max-w-lg border-white/15 bg-[#0c1217] p-0 text-white shadow-[0_28px_100px_rgba(0,0,0,0.55)]">
            <div className="px-8 pb-8 pt-9 text-center">
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${resultDialog?.type === "success" ? "bg-emerald-400/15 text-emerald-400" : resultDialog?.type === "limit" ? "bg-amber-400/15 text-amber-300" : "bg-red-400/15 text-red-400"}`}>
              {resultDialog?.type === "success" ? "✓" : "!"}
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="mt-3 text-center text-2xl text-white">{resultDialog?.type === "success" ? "예약이 완료되었습니다" : resultDialog?.type === "limit" ? "학기당 예약 가능 수량을 초과했습니다" : "예약 신청이 완료되지 않았습니다"}</AlertDialogTitle>
            </AlertDialogHeader>
            {resultDialog?.type === "success" ? (
              <div className="mt-7 text-left">
                <div className="grid grid-cols-[110px_1fr] gap-y-4 border-y border-white/10 px-2 py-5 text-sm">
                  <span className="text-neutral-500">수령 기한</span><strong className="font-semibold text-white">영업일 기준 3일 이내</strong>
                  <span className="text-neutral-500">수령 장소</span><strong className="font-semibold leading-6 text-white">공학관 206호<br />컴퓨터공학부 과사무실</strong>
                </div>
                <div className="mt-4 border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-sm leading-6 text-red-300">
                  기한 내 수령하지 않을 경우 예약은 자동으로 취소됩니다.
                </div>
                <p className="mt-4 text-center text-sm text-neutral-500">예약 내용은 등록된 이메일로 전송되었습니다.</p>
              </div>
            ) : resultDialog?.type === "limit" ? (
              <div className="mt-7 text-left">
                <div className="border-y border-white/10 px-2 py-5">
                  <p className="text-sm font-semibold text-white">한 학기 1인 1기자재 이용 원칙</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">한 학기에는 노트북과 태블릿 PC 중 한 종류만 예약하거나 대여할 수 있습니다.</p>
                </div>
                <div className="mt-4 border border-amber-300/20 bg-amber-300/[0.07] px-4 py-3 text-sm leading-6 text-amber-200">
                  다른 기자재를 예약하려면 기존 예약을 먼저 취소해 주세요. 이미 수령한 기자재는 반납 처리 후 예약할 수 있습니다.
                </div>
              </div>
            ) : <AlertDialogDescription className="mt-5 whitespace-pre-line text-center leading-6 text-neutral-400">{resultDialog?.message}</AlertDialogDescription>}
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogAction onClick={() => { setResultDialog(null); if (!preview && resultDialog?.type === "success") navigate("/lending-state"); }} className="mt-3 min-w-32 bg-white text-black hover:bg-neutral-200">확인</AlertDialogAction>
            </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Lend;
