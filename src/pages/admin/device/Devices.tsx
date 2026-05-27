import { useEffect, useMemo, useState } from "react";
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
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
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
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { DeviceCategoryCombobox } from "../../../components/ui/DeviceCategory";
import { toast } from "sonner";
import DeviceNumberTag from "../../../hooks/useCodeNumberTags";
import {
  useCreateModel,
  useDeleteModel,
  useModels,
  useUpdateModel,
} from "../../../api/adminModel.api";
import { useRegisterItemsByExcel } from "../../../api/adminItem.api";
import type { ModelItem } from "../../../type/adminModel.type";
import type { RegisterItemsExcelData } from "../../../type/adminItem.type";

const ITEMS_PER_PAGE = 10;

const Devices = () => {
  const navigate = useNavigate();

  const [deviceNumber, setDeviceNumber] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [totalQty, setTotalQty] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [subName, setSubName] = useState("");
  const [description, setDescription] = useState("");
  const [visibleToUsers, setVisibleToUsers] = useState(true);

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const [editCategoryName, setEditCategoryName] = useState("");
  const [editName, setEditName] = useState("");
  const [editTotalQty, setEditTotalQty] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editSubName, setEditSubName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVisibleToUsers, setEditVisibleToUsers] = useState(true);

  const [selectedModelIds, setSelectedModelIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [excelDialogOpen, setExcelDialogOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelPreviewData, setExcelPreviewData] =
    useState<RegisterItemsExcelData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const { mutateAsync: registerItemsByExcel, isPending: isExcelRegistering } =
    useRegisterItemsByExcel();
  const { data: devices = [], isLoading, isError } = useModels();
  const { mutateAsync: createModel, isPending: isCreating } = useCreateModel();
  const { mutateAsync: updateModel, isPending: isUpdating } = useUpdateModel();
  const { mutateAsync: deleteModel, isPending: isDeleting } = useDeleteModel();

  const deviceModels = useMemo(() => {
    return (devices as ModelItem[])?.filter(
      (model) => model.type === "EQUIPMENT",
    );
  }, [devices]);

  const selectedSingleModel =
  selectedModelIds.length === 1
    ? deviceModels.find((model) => model.modelId === selectedModelIds[0]) ?? null
    : null;

  const totalPages = Math.ceil(deviceModels.length / ITEMS_PER_PAGE);

  const paginatedDeviceModels = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return deviceModels.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [deviceModels, currentPage]);

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

  const resetCreateForm = () => {
    setCategoryName("");
    setDeviceName("");
    setDisplayName("");
    setSubName("");
    setDescription("");
    setVisibleToUsers(true);
    setTotalQty("");
    setDeviceNumber([]);
  };

  const resetUpdateForm = () => {
    setEditCategoryName("");
    setEditName("");
    setEditDisplayName("");
    setEditSubName("");
    setEditDescription("");
    setEditVisibleToUsers(true);
    setEditTotalQty("");
  };

  const toggleModelSelection = (modelId: number) => {
    setSelectedModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId],
    );
  };

  const handleOpenUpdateDialog = () => {
    if (!selectedSingleModel) {
      toast.error("수정할 기자재를 1개만 선택해주세요.");
      return;
    }
  
    setEditCategoryName(selectedSingleModel.categoryName ?? "");
    setEditName(selectedSingleModel.name ?? "");
    setEditDisplayName(
      selectedSingleModel.displayName ?? selectedSingleModel.name ?? "",
    );
    setEditSubName(selectedSingleModel.subName ?? "");
    setEditDescription(selectedSingleModel.description ?? "");
    setEditVisibleToUsers(selectedSingleModel.visibleToUsers ?? true);
    setEditTotalQty(String(selectedSingleModel.totalQty ?? ""));
  
    setUpdateDialogOpen(true);
  };

  const handleCreateDevice = async () => {
    if (!categoryName.trim()) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }

    if (!deviceName.trim()) {
      toast.error("기자재명을 입력해주세요.");
      return;
    }

    if (!totalQty || Number(totalQty) <= 0) {
      toast.error("기자재 대수를 올바르게 입력해주세요.");
      return;
    }

    try {
      await createModel({
        categoryName,
        type: "EQUIPMENT",
        name: deviceName.trim(),
        displayName: displayName.trim() || deviceName.trim(),
        subName: subName.trim(),
        description: description.trim(),
        visibleToUsers,
        courseName: "",
        totalQty: Number(totalQty),
        serials: deviceNumber,
        qtyAndSerialsSizeMatching: true,
      });

      toast.success("기자재가 추가되었습니다.");
      resetCreateForm();
    } catch (error) {
      console.error(error);
      toast.error("기자재 추가에 실패했습니다.");
    }
  };

  const handleDeleteDevices = async () => {
    if (selectedModelIds.length === 0) {
      toast.error("삭제할 기자재를 선택해주세요.");
      return;
    }

    try {
      await Promise.all(selectedModelIds.map((modelId) => deleteModel(modelId)));
      toast.success("선택한 기자재가 삭제되었습니다.");
      setSelectedModelIds([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("기자재 삭제에 실패했습니다.");
    }
  };

  const handleUpdateDevice = async () => {
    if (!selectedSingleModel) {
      toast.error("수정할 기자재를 1개만 선택해주세요.");
      return;
    }
  
    if (!editCategoryName.trim()) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }
  
    if (!editName.trim()) {
      toast.error("내부 모델명을 입력해주세요.");
      return;
    }
  
    if (!editTotalQty || Number(editTotalQty) < 0) {
      toast.error("총 수량을 올바르게 입력해주세요.");
      return;
    }
  
    try {
      await updateModel({
        modelId: selectedSingleModel.modelId,
        categoryName: editCategoryName,
        type: "EQUIPMENT",
        name: editName.trim(),
        displayName: editDisplayName.trim() || editName.trim(),
        subName: editSubName.trim(),
        description: editDescription.trim(),
        visibleToUsers: editVisibleToUsers,
        courseName: "",
        totalQty: Number(editTotalQty),
        serials: [],
        qtyAndSerialsSizeMatching: true,
      });
  
      toast.success("기자재 정보가 수정되었습니다.");
      setUpdateDialogOpen(false);
      resetUpdateForm();
      setSelectedModelIds([]);
    } catch (error) {
      console.error(error);
      toast.error("기자재 정보 수정에 실패했습니다.");
    }
  };

  const excelPreviewItems = useMemo(() => {
    if (!excelPreviewData) return [];

    return [
      ...(excelPreviewData.addedItems ?? []),
      ...(excelPreviewData.updatedItems ?? []),
      ...(excelPreviewData.deletedItems ?? []),
    ];
  }, [excelPreviewData]);

  const resetExcelForm = () => {
    setExcelFile(null);
    setExcelPreviewData(null);
  };

  const getApiErrorMessage = (error: unknown, fallback: string) => {
    const apiError = error as { response?: { data?: { message?: string } } };
    return apiError.response?.data?.message ?? fallback;
  };

  const handleExcelPreview = async () => {
    if (!excelFile) {
      toast.error("엑셀 파일을 선택해주세요.");
      return;
    }

    try {
      const result = await registerItemsByExcel({
        isConfirm: false,
        file: excelFile,
      });
      setExcelPreviewData(result.data);
      toast.success(result.message || "엑셀 파일 미리보기가 완료되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error(
        getApiErrorMessage(error, "엑셀 파일 미리보기에 실패했습니다."),
      );
    }
  };

  const handleExcelConfirm = async () => {
    if (!excelFile) {
      toast.error("엑셀 파일을 선택해주세요.");
      return;
    }

    if (!excelPreviewData) {
      toast.error("먼저 미리보기를 실행해주세요.");
      return;
    }

    try {
      const result = await registerItemsByExcel({
        isConfirm: true,
        file: excelFile,
      });
      toast.success(result.message || "기자재 일괄 등록이 완료되었습니다.");
      resetExcelForm();
      setExcelDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(
        getApiErrorMessage(error, "기자재 일괄 등록에 실패했습니다."),
      );
    }
  };

  return (
    <div className="px-8 w-screen">
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
              <BreadcrumbPage className="text-white">기기 현황</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
  
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">기자재 현황</div>
  
        <div className="flex space-x-4 justify-end">
          <AlertDialog
            open={excelDialogOpen}
            onOpenChange={(open) => {
              setExcelDialogOpen(open);
              if (!open) resetExcelForm();
            }}
          >
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                일괄 등록
              </div>
            </AlertDialogTrigger>
  
            <AlertDialogContent className="max-w-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle>기자재 엑셀 일괄 등록</AlertDialogTitle>
                <AlertDialogDescription>
                  엑셀 파일을 선택한 뒤 먼저 미리보기를 실행하고, 결과 확인 후
                  실제 등록을 진행합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
  
              <div className="space-y-4">
                <div>
                  <Label className="pb-2">엑셀 파일</Label>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      setExcelFile(e.target.files?.[0] ?? null);
                      setExcelPreviewData(null);
                    }}
                  />
                </div>
  
                <button
                  type="button"
                  onClick={handleExcelPreview}
                  disabled={isExcelRegistering || !excelFile}
                  className={`w-full rounded-sm border px-3 py-2 text-sm ${
                    excelFile
                      ? "cursor-pointer border-neutral-400 hover:bg-neutral-200"
                      : "cursor-not-allowed border-neutral-300 text-neutral-400"
                  }`}
                >
                  {isExcelRegistering ? "처리 중..." : "미리보기"}
                </button>
  
                {excelPreviewData && (
                  <div className="rounded-md border border-neutral-300 p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-md border p-3 text-center">
                        <div className="text-neutral-500">신규 추가</div>
                        <div className="text-lg font-bold">
                          {excelPreviewData.addCount}
                        </div>
                      </div>
                      <div className="rounded-md border p-3 text-center">
                        <div className="text-neutral-500">수정</div>
                        <div className="text-lg font-bold">
                          {excelPreviewData.updateCount}
                        </div>
                      </div>
                      <div className="rounded-md border p-3 text-center">
                        <div className="text-neutral-500">삭제</div>
                        <div className="text-lg font-bold">
                          {excelPreviewData.deleteCount}
                        </div>
                      </div>
                    </div>
  
                    <div className="max-h-64 overflow-y-auto border rounded-md">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-neutral-100">
                          <tr>
                            <th className="border-b px-3 py-2 text-left">
                              시리얼
                            </th>
                            <th className="border-b px-3 py-2 text-left">
                              분류
                            </th>
                            <th className="border-b px-3 py-2 text-left">
                              기자재명
                            </th>
                            <th className="border-b px-3 py-2 text-left">
                              취득일
                            </th>
                            <th className="border-b px-3 py-2 text-left">
                              상태
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {excelPreviewItems.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="px-3 py-6 text-center text-neutral-500"
                              >
                                변경 대상이 없습니다.
                              </td>
                            </tr>
                          ) : (
                            excelPreviewItems.map((item, index) => (
                              <tr key={`${item.serial}-${index}`}>
                                <td className="border-b px-3 py-2">
                                  {item.serial}
                                </td>
                                <td className="border-b px-3 py-2">
                                  {item.categoryName}
                                </td>
                                <td className="border-b px-3 py-2">
                                  {item.modelName}
                                </td>
                                <td className="border-b px-3 py-2">
                                  {item.acquiredAt}
                                </td>
                                <td className="border-b px-3 py-2">
                                  {item.status}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
  
              <AlertDialogFooter className="pt-4">
                <AlertDialogCancel disabled={isExcelRegistering}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    void handleExcelConfirm();
                  }}
                  disabled={isExcelRegistering || !excelPreviewData}
                >
                  {isExcelRegistering ? "등록 중..." : "실제 등록"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
  
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                추가
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent className="w-[92vw] sm:w-[76vw] sm:max-w-[1200px] max-h-[88vh] overflow-y-auto border border-neutral-300 bg-white text-black">
              <div className="flex items-start justify-between gap-4">
                <AlertDialogHeader className="space-y-2 text-left">
                  <AlertDialogTitle className="text-black">
                    기자재 추가
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-neutral-500">
                    내부 관리 정보와 학생 화면 표기 정보를 함께 등록합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex shrink-0 items-center gap-2 pt-1">
                  <AlertDialogCancel
                    disabled={isCreating}
                    className="mt-0 border-neutral-300 bg-white text-black hover:bg-neutral-100"
                  >
                    취소
                  </AlertDialogCancel>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      void handleCreateDevice();
                    }}
                    disabled={isCreating}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isCreating ? "추가 중..." : "추가"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-semibold text-black">내부 관리 정보</div>

                    <div>
                      <Label className="pb-2 text-neutral-700">카테고리</Label>
                      <DeviceCategoryCombobox
                        value={categoryName}
                        onChange={setCategoryName}
                      />
                    </div>

                    <div>
                      <Label className="pb-2 text-neutral-700">내부 모델명</Label>
                      <Input
                        className="border-neutral-300 bg-white text-black placeholder:text-neutral-400"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        placeholder="관리자용 모델명을 입력하세요"
                      />
                    </div>

                    <div>
                      <Label className="pb-2 text-neutral-700">총 보유 수량</Label>
                      <Input
                        type="number"
                        min={1}
                        className="border-neutral-300 bg-white text-black placeholder:text-neutral-400"
                        value={totalQty}
                        onChange={(e) => setTotalQty(e.target.value)}
                        placeholder="기자재 대수를 입력하세요"
                      />
                    </div>

                    <div>
                      <DeviceNumberTag
                        value={deviceNumber}
                        onChange={setDeviceNumber}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-semibold text-black">학생 화면 정보</div>

                    <div>
                      <Label className="pb-2 text-neutral-700">기기 분류</Label>
                      <Input
                        className="border-neutral-300 bg-white text-black placeholder:text-neutral-400"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="예: 갤럭시 탭"
                      />
                    </div>

                    <div>
                      <Label className="pb-2 text-neutral-700">모델명</Label>
                      <Input
                        className="border-neutral-300 bg-white text-black placeholder:text-neutral-400"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        placeholder="예: S8"
                      />
                    </div>

                    <div>
                      <Label className="pb-2 text-neutral-700">상세 안내 문구</Label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="학생 화면에서 더보기로 보여줄 설명"
                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-neutral-400 resize-none"
                      />
                    </div>

                    <Label className="flex items-center gap-2 cursor-pointer pt-1">
                      <Checkbox
                        checked={visibleToUsers}
                        onCheckedChange={(checked) =>
                          setVisibleToUsers(checked === true)
                        }
                      />
                      <span className="text-sm text-neutral-700">학생 화면에 표시</span>
                    </Label>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <div className="text-sm font-semibold text-black">학생 화면 미리보기</div>

                  <div className="mt-3 rounded-2xl border border-neutral-700 bg-[#060a0c] p-5 min-h-[240px]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 max-w-[85%]">
                        <div className="text-2xl font-semibold text-white leading-tight break-keep">
                          {displayName || deviceName || "사용자 표기 분류"}
                        </div>

                        <div className="mt-3 text-sm text-neutral-300 leading-6 break-keep">
                          {subName || "모델명이 여기에 표시됩니다."}
                        </div>
                      </div>

                      <div
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                          visibleToUsers
                            ? "border-green-400/40 bg-green-500/10 text-green-300"
                            : "border-neutral-500/40 bg-neutral-500/10 text-neutral-400"
                        }`}
                      >
                        {visibleToUsers ? "표시" : "숨김"}
                      </div>
                    </div>

                    <div className="mt-6 text-sm leading-7 whitespace-pre-wrap text-neutral-400 break-keep">
                      {description || "상세 안내 문구가 여기에 표시됩니다."}
                    </div>

                    <div className="mt-8 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
                      내부 모델명: {deviceName || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
  
          <AlertDialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={selectedModelIds.length !== 1}
                onClick={handleOpenUpdateDialog}
                className={`text-sm px-3 py-1 rounded-sm border ${
                  selectedModelIds.length === 1
                    ? "cursor-pointer hover:bg-neutral-400 hover:text-black border-neutral-400 text-white"
                    : "cursor-not-allowed border-neutral-700 text-neutral-600"
                }`}
              >
                수정
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="w-[92vw] sm:w-[76vw] sm:max-w-[1200px] max-h-[88vh] overflow-y-auto border border-neutral-300 bg-white text-black">
              <div className="flex items-start justify-between gap-4">
                <AlertDialogHeader className="space-y-2 text-left">
                  <AlertDialogTitle className="text-black">
                    기자재 정보 수정
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-neutral-500">
                    관리 정보와 학생 화면 정보를 함께 수정합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex shrink-0 items-center gap-2 pt-1">
                  <AlertDialogCancel
                    disabled={isUpdating}
                    className="mt-0 border-neutral-300 bg-white text-black hover:bg-neutral-100"
                  >
                    취소
                  </AlertDialogCancel>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      void handleUpdateDevice();
                    }}
                    disabled={isUpdating}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {isUpdating ? "수정 중..." : "저장"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-semibold text-black">관리 정보</div>

                    <div>
                      <Label className="pb-2 text-neutral-700">카테고리</Label>
                      <DeviceCategoryCombobox
                        value={editCategoryName}
                        onChange={setEditCategoryName}
                      />
                    </div>

                    <div>
                      <Label className="pb-2 text-neutral-700">내부 모델명</Label>
                      <Input
                        className="border-neutral-300 bg-white text-black placeholder:text-neutral-400"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="관리자용 모델명을 입력하세요"
                      />
                    </div>

                    <div>
                      <Label className="pb-2 text-neutral-700">총 보유 수량</Label>
                      <Input
                        type="number"
                        min={0}
                        className="border-neutral-300 bg-white text-black placeholder:text-neutral-400"
                        value={editTotalQty}
                        onChange={(e) => setEditTotalQty(e.target.value)}
                        placeholder="총 수량을 입력하세요"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm font-semibold text-black">학생 화면 정보</div>

                    <div>
                      <Label className="pb-2 text-neutral-700">기기 분류</Label>
                      <Input
                        className="border-neutral-300 bg-white text-black placeholder:text-neutral-400"
                        value={editDisplayName}
                        onChange={(e) => setEditDisplayName(e.target.value)}
                        placeholder="예: 갤럭시 탭"
                      />
                    </div>

                    <div>
                      <Label className="pb-2 text-neutral-700">모델명</Label>
                      <Input
                        className="border-neutral-300 bg-white text-black placeholder:text-neutral-400"
                        value={editSubName}
                        onChange={(e) => setEditSubName(e.target.value)}
                        placeholder="예: S8"
                      />
                    </div>

                    <div>
                      <Label className="pb-2 text-neutral-700">상세 안내 문구</Label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={1}
                        placeholder="학생 화면에서 더보기로 보여줄 설명"
                        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none placeholder:text-neutral-400 resize-none"
                      />
                    </div>

                    <Label className="flex items-center gap-2 cursor-pointer pt-1">
                      <Checkbox
                        checked={editVisibleToUsers}
                        onCheckedChange={(checked) =>
                          setEditVisibleToUsers(checked === true)
                        }
                      />
                      <span className="text-sm text-neutral-700">학생 화면에 표시</span>
                    </Label>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-white p-4">
                  <div className="text-sm font-semibold text-black">학생 화면 미리보기</div>

                  <div className="mt-3 rounded-2xl border border-neutral-700 bg-[#060a0c] p-5 min-h-[240px]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 max-w-[85%]">
                        <div className="text-2xl font-semibold text-white leading-tight break-keep">
                          {editDisplayName || editName || "사용자 표기 분류"}
                        </div>

                        <div className="mt-3 text-sm text-neutral-300 leading-6 break-keep">
                          {editSubName || "모델명이 여기에 표시됩니다."}
                        </div>
                      </div>

                      <div
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                          editVisibleToUsers
                            ? "border-green-400/40 bg-green-500/10 text-green-300"
                            : "border-neutral-500/40 bg-neutral-500/10 text-neutral-400"
                        }`}
                      >
                        {editVisibleToUsers ? "표시" : "숨김"}
                      </div>
                    </div>

                    <div className="mt-6 text-sm leading-7 whitespace-pre-wrap text-neutral-400 break-keep">
                      {editDescription || "상세 안내 문구가 여기에 표시됩니다."}
                    </div>

                    <div className="mt-8 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
                      내부 모델명: {editName || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={selectedModelIds.length === 0}
                className={`text-sm px-3 py-1 rounded-sm border ${
                  selectedModelIds.length > 0
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
                  선택한 기자재를 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  기자재를 삭제하면 다시 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
  
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    void handleDeleteDevices();
                  }}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-500 font-bold"
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
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
                <TableHead className="text-white text-center">분류</TableHead>
                <TableHead className="text-white text-center">기자재명</TableHead>
                <TableHead className="text-white text-center">잔여 대수</TableHead>
                <TableHead className="text-white text-center">예약 중</TableHead>
                <TableHead className="text-white text-center">대여 완료</TableHead>
                <TableHead className="text-white text-center">
                  고장/분실
                </TableHead>
                <TableHead className="text-white text-center">표시 상태</TableHead>
                <TableHead className="text-white text-center">총합</TableHead>
              </TableRow>
            </TableHeader>
  
            <TableBody className="cursor-pointer">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-red-300"
                  >
                    기자재 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              ) : deviceModels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">
                    등록된 기자재가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDeviceModels.map((device: ModelItem) => {
                  const checked = selectedModelIds.includes(device.modelId);
  
                  return (
                    <TableRow
                      key={device.modelId}
                      onClick={() => navigate(`/admin/devices/${device.modelId}`)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            toggleModelSelection(device.modelId)
                          }
                        />
                      </TableCell>
                      <TableCell>{device.categoryName}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {device.displayName || device.name}
                        </div>
                        {device.displayName && device.displayName !== device.name ? (
                          <div className="text-xs text-neutral-500 mt-1">
                            {device.name}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>{device.availableQty}</TableCell>
                      <TableCell>{device.reservedQty}</TableCell>
                      <TableCell>{device.rentedQty}</TableCell>
                      <TableCell>{device.breakdownQty + device.lostQty}</TableCell>
                      <TableCell>
                        {device.visibleToUsers ? (
                          <span className="rounded-full border border-green-400 px-2 py-1 text-xs text-green-300">
                            표시
                          </span>
                        ) : (
                          <span className="rounded-full border border-neutral-500 px-2 py-1 text-xs text-neutral-400">
                            숨김
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-bold">{device.totalQty}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
  
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={
                        currentPage === 0
                          ? "pointer-events-none opacity-50 text-neutral-500"
                          : "cursor-pointer text-white hover:text-black"
                      }
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
                        className={
                          pageNumber === currentPage
                            ? "cursor-pointer bg-white text-black border-white"
                            : "cursor-pointer text-white hover:text-black"
                        }
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
                      className={
                        currentPage >= totalPages - 1
                          ? "pointer-events-none opacity-50 text-neutral-500"
                          : "cursor-pointer text-white hover:text-black"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;