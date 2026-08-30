import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
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
  useAdminItemOccupancy,
  useAdminItemHistory,
  useAdminItemsByModel,
  useCreateAdminItem,
  useDeleteAdminItem,
  useUpdateAdminItem,
} from "../../../api/adminItem.api";
import { useModels } from "../../../api/adminModel.api";
import type {
  AdminItem,
  ItemRentalHistoryEntry,
  ItemState,
} from "../../../type/adminItem.type";
import type { ModelItem } from "../../../type/adminModel.type";

const Device = () => {
  const navigate = useNavigate();
  const { modelId } = useParams();
  const parsedModelId = Number(modelId);

  const {
    data: items = [],
    isLoading,
    isError,
  } = useAdminItemsByModel(parsedModelId);

  const { data: models = [] } = useModels();

  const { mutate: createAdminItem, isPending: isCreating } =
    useCreateAdminItem();
  const { mutate: updateAdminItem, isPending: isUpdating } =
    useUpdateAdminItem();
  const { mutate: deleteAdminItem, isPending: isDeleting } =
    useDeleteAdminItem();

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const [createSerial, setCreateSerial] = useState("");
  const [createAcquiredAt, setCreateAcquiredAt] = useState("");

  const [editSerial, setEditSerial] = useState("");
  const [editState, setEditState] = useState<ItemState>("BREAKDOWN");

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isOccupancyDialogOpen, setIsOccupancyDialogOpen] = useState(false);
  const [occupancyItemId, setOccupancyItemId] = useState<number | null>(null);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [historyItemId, setHistoryItemId] = useState<number | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [selectedHistory, setSelectedHistory] =
    useState<ItemRentalHistoryEntry | null>(null);

  const selectedItem =
    items.find((item: AdminItem) => item.itemId === selectedItemId) ?? null;

  const selectedModel = useMemo(() => {
    return (models as ModelItem[]).find(
      (model) => model.modelId === parsedModelId,
    );
  }, [models, parsedModelId]);

  const { data: occupancyData, isLoading: isOccupancyLoading } =
  useAdminItemOccupancy(occupancyItemId ?? undefined, isOccupancyDialogOpen);

  const { data: historyData, isLoading: isHistoryLoading } =
    useAdminItemHistory(
      historyItemId ?? undefined,
      historyPage,
      10,
      isHistoryDialogOpen,
    );

  const getStateLabel = (state: ItemState) => {
    switch (state) {
      case "AVAILABLE":
        return "대여 가능";
      case "RESERVED":
        return "예약 중";
      case "RENTED":
        return "대여 중";
      case "BREAKDOWN":
        return "고장";
      case "LOST":
        return "분실";
      default:
        return state;
    }
  };

  const getStateBadgeClass = (state: ItemState) => {
    switch (state) {
      case "AVAILABLE":
        return "text-green-300";
      case "RESERVED":
        return "text-yellow-300";
      case "RENTED":
        return "text-blue-300";
      case "BREAKDOWN":
        return "text-orange-300";
      case "LOST":
        return "text-red-300";
      default:
        return "text-white";
    }
  };

  const canManuallyChangeState = (state: ItemState) => {
    return state !== "RESERVED" && state !== "RENTED";
  };

  const getAllowedNextStates = (state: ItemState): ItemState[] => {
    switch (state) {
      case "AVAILABLE":
        return ["BREAKDOWN", "LOST"];
      case "BREAKDOWN":
      case "LOST":
        return ["AVAILABLE"];
      default:
        return [];
    }
  };

  const canViewOccupancy = (state: ItemState) => {
    return state === "RESERVED" || state === "RENTED";
  };
  
  const getOccupancyButtonLabel = (state: ItemState) => {
    if (state === "RESERVED") return "예약자 보기";
    if (state === "RENTED") return "대여자 보기";
    return "";
  };
  
  const handleOpenOccupancyDialog = (itemId: number) => {
    setOccupancyItemId(itemId);
    setIsOccupancyDialogOpen(true);
  };

  const handleOpenHistoryDialog = (itemId: number) => {
    setHistoryItemId(itemId);
    setHistoryPage(0);
    setSelectedHistory(null);
    setIsHistoryDialogOpen(true);
  };

  const formatDateTime = (value?: string | null) =>
    value ? new Date(value).toLocaleString("ko-KR") : "-";

  const formatOccupiedTime = (minutes: number) => {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    const remainingMinutes = minutes % 60;
    return `${days}일 ${hours}시간 ${remainingMinutes}분`;
  };

  useEffect(() => {
    if (!selectedItem) return;

    setEditSerial(selectedItem.serial);

    const allowedNextStates = getAllowedNextStates(selectedItem.state);
    setEditState(allowedNextStates[0] ?? selectedItem.state);
  }, [selectedItem]);

  const handleCreateItem = () => {
    if (!parsedModelId) {
      toast.error("잘못된 모델 접근입니다.");
      return;
    }

    if (!createSerial.trim()) {
      toast.error("시리얼 번호를 입력해주세요.");
      return;
    }

    if (!createAcquiredAt.trim()) {
      toast.error("취득일을 입력해주세요.");
      return;
    }

    createAdminItem(
      {
        modelId: parsedModelId,
        serial: createSerial.trim(),
        state: "AVAILABLE",
        acquiredAt: createAcquiredAt,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "기자재가 추가되었습니다.");
          setCreateSerial("");
          setCreateAcquiredAt("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "기자재 추가에 실패했습니다.",
          );
        },
      },
    );
  };

  const handleUpdateItem = () => {
    if (!selectedItem) {
      toast.error("수정할 기자재를 선택해주세요.");
      return;
    }

    if (!canManuallyChangeState(selectedItem.state)) {
      toast.error("예약 중이거나 대여 중인 기자재는 상태를 변경할 수 없습니다.");
      return;
    }

    if (!editSerial.trim()) {
      toast.error("시리얼 번호를 입력해주세요.");
      return;
    }

    const allowedNextStates = getAllowedNextStates(selectedItem.state);

    if (!allowedNextStates.includes(editState)) {
      toast.error("현재 상태에서 변경할 수 없는 상태입니다.");
      return;
    }

    updateAdminItem(
      {
        itemId: selectedItem.itemId,
        modelId: parsedModelId,
        serial: editSerial.trim(),
        state: editState,
        acquiredAt: selectedItem.acquiredAt ?? "",
      },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "기자재 상태가 수정되었습니다.");
          setIsUpdateDialogOpen(false);
          setSelectedItemId(null);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "기자재 수정에 실패했습니다.",
          );
        },
      },
    );
  };

  const handleDeleteItem = () => {
    if (!selectedItem) {
      toast.error("삭제할 기자재를 선택해주세요.");
      return;
    }

    deleteAdminItem(
      {
        itemId: selectedItem.itemId,
        modelId: parsedModelId,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message ?? "기자재가 삭제되었습니다.");
          setSelectedItemId(null);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "기자재 삭제에 실패했습니다.",
          );
        },
      },
    );
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
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/admin/devices"
              >
                기기 현황
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
        <div className="flex items-start justify-between gap-4 pb-8">
          <div>
            <div className="font-bold text-white text-3xl">
              {selectedModel?.name ?? "기기 상세 현황"}
            </div>
            <div className="mt-2 text-sm text-neutral-400">
              {selectedModel
                ? `${selectedModel.categoryName} / 총 ${selectedModel.totalQty}대`
                : "모델 정보를 불러오는 중입니다."}
            </div>
          </div>

          <div className="flex space-x-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="hover:bg-neutral-800 cursor-pointer border border-neutral-400 text-neutral-200 text-sm px-3 py-1 rounded-sm">
                  시리얼 추가
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>기자재 시리얼 추가</AlertDialogTitle>
                  <AlertDialogDescription>
                    {selectedModel?.name ?? "선택한 모델"}에 새로운 item을 추가합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label className="pb-2">시리얼 번호</Label>
                    <Input
                      value={createSerial}
                      onChange={(e) => setCreateSerial(e.target.value)}
                      placeholder="예: IPAD-AIR-001"
                    />
                  </div>

                  <div>
                    <Label className="pb-2">취득일</Label>
                    <Input
                      type="date"
                      value={createAcquiredAt}
                      onChange={(e) => setCreateAcquiredAt(e.target.value)}
                    />
                  </div>
                </div>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreateItem();
                    }}
                    disabled={isCreating}
                  >
                    {isCreating ? "추가 중..." : "추가"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={!selectedItem}
                  className={`px-3 py-1 rounded-sm border text-sm ${
                    selectedItem
                      ? "cursor-pointer border-neutral-400 text-neutral-200 hover:bg-neutral-800"
                      : "cursor-not-allowed border-neutral-700 text-neutral-600"
                  }`}
                >
                  수정
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {selectedItem
                      ? `${selectedItem.serial} 상태 수정`
                      : "기자재 수정"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    현재 상태에 따라 변경 가능한 상태만 선택할 수 있습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {selectedItem && !canManuallyChangeState(selectedItem.state) && (
                  <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                    예약 중이거나 대여 중인 기자재는 수정할 수 없습니다.
                  </div>
                )}

                <div>
                  <Table className="text-center border border-neutral-200">
                    <TableBody>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          Item ID
                        </TableCell>
                        <TableCell className="text-left px-6 text-black">
                          {selectedItem?.itemId}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          모델명
                        </TableCell>
                        <TableCell className="text-left px-6 text-black">
                          {selectedModel?.name}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          시리얼 번호
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input
                            className="text-sm"
                            value={editSerial}
                            onChange={(e) => setEditSerial(e.target.value)}
                            disabled={
                              !selectedItem ||
                              !canManuallyChangeState(selectedItem.state)
                            }
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          현재 상태
                        </TableCell>
                        <TableCell className="text-left px-4 text-black">
                          {selectedItem ? getStateLabel(selectedItem.state) : "-"}
                        </TableCell>
                      </TableRow>

                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          변경 상태
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <select
                            value={editState}
                            onChange={(e) =>
                              setEditState(e.target.value as ItemState)
                            }
                            disabled={
                              !selectedItem ||
                              !canManuallyChangeState(selectedItem.state)
                            }
                            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-black"
                          >
                            {selectedItem &&
                              getAllowedNextStates(selectedItem.state).map(
                                (state) => (
                                  <option key={state} value={state}>
                                    {getStateLabel(state)}
                                  </option>
                                ),
                              )}
                          </select>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="cursor-pointer">
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateItem();
                    }}
                    disabled={
                      !selectedItem ||
                      isUpdating ||
                      !canManuallyChangeState(selectedItem.state)
                    }
                    className="hover:bg-neutral-700 font-bold cursor-pointer"
                  >
                    {isUpdating ? "수정 중..." : "수정"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={!selectedItem}
                  className={`px-3 py-1 rounded-sm border text-sm ${
                    selectedItem
                      ? "cursor-pointer hover:bg-red-400 hover:text-black border-red-400 text-red-300"
                      : "cursor-not-allowed border-neutral-700 text-neutral-600"
                  }`}
                >
                  삭제
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {selectedItem
                      ? `${selectedItem.serial} 을(를) 삭제하시겠습니까?`
                      : "삭제할 기자재를 선택해주세요."}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    기자재를 삭제하면 다시 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteItem();
                    }}
                    disabled={!selectedItem || isDeleting}
                    className="bg-red-600 hover:bg-red-500 font-bold"
                  >
                    {isDeleting ? "삭제 중..." : "삭제"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-neutral-400">
            항목을 하나 선택한 뒤 수정/삭제할 수 있습니다.
          </div>
          <button
            type="button"
            onClick={() => navigate("/admin/devices")}
            className="text-sm text-neutral-300 underline underline-offset-4"
          >
            목록으로 돌아가기
          </button>
        </div>

        <div className="mt-4">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-white text-center">
                  시리얼 번호
                </TableHead>
                <TableHead className="text-white text-center">상태</TableHead>
                <TableHead className="text-white text-center">현재 이용자</TableHead>
                <TableHead className="text-white text-center">대여 이력</TableHead>
                <TableHead className="text-white text-center">취득일</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-6 text-center text-red-300"
                  >
                    기자재 상세 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center">
                    등록된 item이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item: AdminItem) => (
                  <TableRow
                    key={item.itemId}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedItemId((prev) =>
                        prev === item.itemId ? null : item.itemId,
                      )
                    }
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedItemId === item.itemId}
                        onCheckedChange={(checked) =>
                          setSelectedItemId(checked ? item.itemId : null)
                        }
                      />
                    </TableCell>

                    <TableCell>{item.serial}</TableCell>

                    <TableCell className={getStateBadgeClass(item.state)}>
                      {getStateLabel(item.state)}
                    </TableCell>

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {canViewOccupancy(item.state) ? (
                        <button
                          type="button"
                          onClick={() => handleOpenOccupancyDialog(item.itemId)}
                          className="rounded-sm border border-neutral-500 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-800"
                        >
                          {getOccupancyButtonLabel(item.state)}
                        </button>
                      ) : (
                        <span className="text-neutral-500 text-sm">-</span>
                      )}
                    </TableCell>

                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenHistoryDialog(item.itemId)}
                        className="rounded-sm border border-neutral-500 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-800"
                      >
                        이력 보기
                      </button>
                    </TableCell>

                    <TableCell>{item.acquiredAt || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <AlertDialog
            open={isOccupancyDialogOpen}
            onOpenChange={(open) => {
              setIsOccupancyDialogOpen(open);
              if (!open) {
                setOccupancyItemId(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {occupancyData?.occupancyType === "RESERVATION"
                    ? "현재 예약자 정보"
                    : occupancyData?.occupancyType === "RENTAL"
                      ? "현재 대여자 정보"
                      : "현재 이용자 정보"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  선택한 시리얼의 현재 점유 정보를 확인합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {isOccupancyLoading ? (
                <div className="py-6 text-center text-sm text-neutral-400">
                  불러오는 중...
                </div>
              ) : !occupancyData ? (
                <div className="py-6 text-center text-sm text-neutral-400">
                  현재 점유자가 없습니다.
                </div>
              ) : (
                <Table className="text-center border border-neutral-200">
                  <TableBody>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/4 bg-neutral-300">이름</TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {occupancyData.username}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="bg-neutral-300">학번</TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {occupancyData.studentId}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="bg-neutral-300">이메일</TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {occupancyData.email}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="bg-neutral-300">학기</TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {occupancyData.semester}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="bg-neutral-300">
                        {occupancyData.occupancyType === "RESERVATION"
                          ? "예약 시작 시각"
                          : "대여 시작 시각"}
                      </TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {occupancyData.startedAt
                          ? new Date(occupancyData.startedAt).toLocaleString("ko-KR")
                          : "-"}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="bg-neutral-300">
                        {occupancyData.occupancyType === "RESERVATION"
                          ? "예약 만료 시각"
                          : "반납 기한"}
                      </TableCell>
                      <TableCell className="text-left px-6 text-black">
                        {occupancyData.dueAt
                          ? new Date(occupancyData.dueAt).toLocaleString("ko-KR")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel>닫기</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={isHistoryDialogOpen}
            onOpenChange={(open) => {
              setIsHistoryDialogOpen(open);
              if (!open) {
                setHistoryItemId(null);
                setHistoryPage(0);
                setSelectedHistory(null);
              }
            }}
          >
            <AlertDialogContent className="max-w-4xl">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {historyData
                    ? `${historyData.modelName} · ${historyData.serial} 대여 이력`
                    : "기자재 대여 이력"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  총 {historyData?.histories.totalElements ?? 0}건의 대여 기록입니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {isHistoryLoading && !historyData ? (
                <div className="py-10 text-center text-sm text-neutral-500">
                  이력을 불러오는 중...
                </div>
              ) : !historyData || historyData.histories.content.length === 0 ? (
                <div className="rounded-md border border-neutral-200 py-10 text-center text-sm text-neutral-500">
                  대여 이력이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="max-h-72 overflow-y-auto rounded-md border border-neutral-200">
                    <Table className="text-center">
                      <TableHeader className="bg-neutral-100">
                        <TableRow>
                          <TableHead className="text-center">학기</TableHead>
                          <TableHead className="text-center">대여자</TableHead>
                          <TableHead className="text-center">대여일</TableHead>
                          <TableHead className="text-center">상태</TableHead>
                          <TableHead className="text-center">상세</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historyData.histories.content.map((history) => (
                          <TableRow key={history.rentalId} className="hover:bg-neutral-50">
                            <TableCell>{history.specialRental ? "특별 대여" : history.semester}</TableCell>
                            <TableCell>
                              {history.username} ({history.studentId})
                            </TableCell>
                            <TableCell>{formatDateTime(history.rentedAt).split(" ").slice(0, 3).join(" ")}</TableCell>
                            <TableCell>
                              <span className={history.currentlyRenting ? "text-blue-600" : "text-neutral-600"}>
                                {history.currentlyRenting ? "대여 중" : "반납 완료"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <button
                                type="button"
                                onClick={() => setSelectedHistory(history)}
                                className="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100"
                              >
                                상세 조회
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {selectedHistory && (
                    <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800">
                      <div className="mb-3 font-semibold">대여 상세</div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div><span className="text-neutral-500">이름</span><div>{selectedHistory.username}</div></div>
                        <div><span className="text-neutral-500">학번</span><div>{selectedHistory.studentId}</div></div>
                        <div><span className="text-neutral-500">이메일</span><div>{selectedHistory.email}</div></div>
                        <div><span className="text-neutral-500">학기</span><div>{selectedHistory.specialRental ? "특별 대여" : selectedHistory.semester}</div></div>
                        <div><span className="text-neutral-500">대여 시각</span><div>{formatDateTime(selectedHistory.rentedAt)}</div></div>
                        <div><span className="text-neutral-500">반납 시각</span><div>{selectedHistory.currentlyRenting ? "대여 중" : formatDateTime(selectedHistory.returnedAt)}</div></div>
                        <div className="col-span-2"><span className="text-neutral-500">점유 기간</span><div className="font-semibold">{formatOccupiedTime(selectedHistory.occupiedMinutes)} · {selectedHistory.occupiedDays}일 점유(24시간 기준 올림)</div></div>
                      </div>
                    </div>
                  )}

                  {historyData.histories.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <button
                        type="button"
                        disabled={historyPage === 0}
                        onClick={() => { setHistoryPage((page) => page - 1); setSelectedHistory(null); }}
                        className="rounded border border-neutral-300 px-3 py-1 disabled:opacity-40"
                      >
                        이전
                      </button>
                      <span>{historyPage + 1} / {historyData.histories.totalPages}</span>
                      <button
                        type="button"
                        disabled={historyPage + 1 >= historyData.histories.totalPages}
                        onClick={() => { setHistoryPage((page) => page + 1); setSelectedHistory(null); }}
                        className="rounded border border-neutral-300 px-3 py-1 disabled:opacity-40"
                      >
                        다음
                      </button>
                    </div>
                  )}
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel>닫기</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default Device;
