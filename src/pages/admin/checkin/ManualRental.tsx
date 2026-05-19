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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "../../../components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { Search } from "lucide-react";
import { ItemCombobox } from "../../../components/ui/ItemCombobox";
import { Label } from "../../../components/ui/label";
import { useAdminUsers } from "../../../api/admin.api";
import { useModels } from "../../../api/adminModel.api";
import { useItemAvailable } from "../../../api/adminItem.api";
import { useManualRental } from "../../../api/adminRental.api";

const USERS_PAGE_SIZE = 20;
const MAX_PAGE_BUTTONS = 5;

const ManualRental = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const [checkedRoles, setCheckedRoles] = useState({
    ADMIN: true,
    USER: true,
  });

  const [checkedStates, setCheckedStates] = useState({
    ACTIVE: true,
    BANNED: true,
  });

  const { data: modelsData } = useModels();
  const models = modelsData ?? [];

  const { mutate: manualRental, isPending: isManualRentalPending } =
    useManualRental();

  const { data: availableItems = [], isLoading: isAvailableItemsLoading } =
    useItemAvailable(selectedModelId);

  const rolesParam = useMemo(() => {
    const roles: string[] = [];
    if (checkedRoles.ADMIN) roles.push("ADMIN");
    if (checkedRoles.USER) roles.push("USER");
    return roles.join(",");
  }, [checkedRoles]);

  const statesParam = useMemo(() => {
    const states: string[] = [];
    if (checkedStates.ACTIVE) states.push("ACTIVE");
    if (checkedStates.BANNED) states.push("BANNED");
    return states.join(",");
  }, [checkedStates]);

  const { data, isLoading, isError } = useAdminUsers({
    roles: rolesParam,
    states: statesParam,
    keyword,
    page: currentPage,
    size: USERS_PAGE_SIZE,
    sort: "",
  });
  const users = data?.content ?? [];

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
    setSelectedUserId(null);
  };

  const selectedUser =
    users.find((user) => user.userId === selectedUserId) ?? null;

  const handleOpenManualRentalDialog = () => {
    setSelectedModelId(null);
    setSelectedItemId("");
  };

  const handleSubmitManualRental = () => {
    if (!selectedUser) {
      toast("대여 등록할 사용자를 선택해주세요.");
      return;
    }

    if (!selectedModelId) {
      toast("기기를 선택해주세요.");
      return;
    }

    if (!selectedItemId) {
      toast("기기 번호를 선택해주세요.");
      return;
    }

    manualRental(
      {
        studentId: selectedUser.studentId,
        itemId: Number(selectedItemId),
      },
      {
        onSuccess: (res) => {
          toast(res.message ?? "수기 대여가 등록되었습니다.");
          setIsEditDialogOpen(false);
          setSelectedUserId(null);
          setSelectedModelId(null);
          setSelectedItemId("");
          navigate(`/admin/users/${selectedUserId}`);
        },
        onError: (error) => {
          toast(
            error instanceof Error
              ? error.message
              : "수기 대여 등록에 실패했습니다.",
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
              <BreadcrumbPage className="text-white">
                수기 대여 등록
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8 pb-4">
        <div className="font-bold text-white text-3xl pb-4">수기 대여 등록</div>
      </div>

      <div className="flex justify-between items-center pr-2">
        <div className="relative w-3/5 md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3 h-3 md:w-5 md:h-5" />
          <Input
            placeholder="학번 또는 이름을 입력해주세요."
            className="border-neutral-400 pl-8 md:pl-10 text-sm"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(0);
              setSelectedUserId(null);
            }}
          />
        </div>

        <div className="flex space-x-2">
          <AlertDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={!selectedUser}
                onClick={handleOpenManualRentalDialog}
                className={`border text-sm px-3 py-1 rounded-sm ${selectedUser ? "hover:bg-neutral-800 cursor-pointer border-neutral-400 text-neutral-200" : "cursor-not-allowed border-neutral-700 text-neutral-600"}`}
              >
                대여 등록
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedUser
                    ? `#${selectedUser.userId} ${selectedUser.username}`
                    : "대여 등록"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  사용자에게 기기 대여가 수동으로 부여됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div>
                <Table className="text-center border border-neutral-200">
                  <TableBody>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        학번
                      </TableCell>
                      <TableCell className="text-left px-6">
                        {selectedUser?.studentId}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        이름
                      </TableCell>
                      <TableCell className="text-left px-6">
                        {selectedUser?.username}
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        기기
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <ItemCombobox
                          value={selectedModelId ? String(selectedModelId) : ""}
                          onChange={(value) => {
                            setSelectedModelId(value ? Number(value) : null);
                            setSelectedItemId("");
                          }}
                          items={models.map(
                            (model: { modelId: number; name: string }) => ({
                              value: String(model.modelId),
                              label: model.name,
                            }),
                          )}
                          placeholder="기기 선택"
                          searchPlaceholder="기기 검색"
                          emptyText="검색에 맞는 기기가 없습니다."
                          triggerClassName="w-[300px]"
                          contentClassName="w-[360px]"
                          listClassName="max-h-[280px]"
                        />
                      </TableCell>
                    </TableRow>

                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        기기 번호
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <ItemCombobox
                          value={selectedItemId}
                          onChange={setSelectedItemId}
                          disabled={!selectedModelId || isAvailableItemsLoading}
                          items={availableItems.map(
                            (item: { itemId: number; serial: string }) => ({
                              value: String(item.itemId),
                              label: item.serial,
                            }),
                          )}
                          placeholder={
                            !selectedModelId
                              ? "기기를 먼저 선택해주세요"
                              : isAvailableItemsLoading
                                ? "불러오는 중..."
                                : "기기 번호 선택"
                          }
                          searchPlaceholder="기기 번호 검색"
                          emptyText="대여 가능한 기기 번호가 없습니다."
                        />
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
                  className="bg-black font-bold"
                  disabled={
                    !selectedUser ||
                    !selectedModelId ||
                    !selectedItemId ||
                    isManualRentalPending
                  }
                  onClick={handleSubmitManualRental}
                >
                  {isManualRentalPending ? "등록 중..." : "등록"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex items-center space-x-4 py-4">
        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedRoles.ADMIN}
            onCheckedChange={(checked) => {
              setCheckedRoles((prev) => ({ ...prev, ADMIN: checked === true }));
              setCurrentPage(0);
              setSelectedUserId(null);
            }}
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">관리자</p>
        </Label>

        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedRoles.USER}
            onCheckedChange={(checked) => {
              setCheckedRoles((prev) => ({ ...prev, USER: checked === true }));
              setCurrentPage(0);
              setSelectedUserId(null);
            }}
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">사용자</p>
        </Label>
      </div>

      <div className="flex items-center space-x-4 pb-4">
        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedStates.ACTIVE}
            onCheckedChange={(checked) => {
              setCheckedStates((prev) => ({
                ...prev,
                ACTIVE: checked === true,
              }));
              setCurrentPage(0);
              setSelectedUserId(null);
            }}
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">ACTIVE</p>
        </Label>

        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedStates.BANNED}
            onCheckedChange={(checked) => {
              setCheckedStates((prev) => ({
                ...prev,
                BANNED: checked === true,
              }));
              setCurrentPage(0);
              setSelectedUserId(null);
            }}
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">BANNED</p>
        </Label>
      </div>

      <div className="mt-4">
        <Table className="text-white text-center border border-neutral-700">
          <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-white text-center">순번</TableHead>
              <TableHead className="text-white text-center">이름</TableHead>
              <TableHead className="text-white text-center">학번</TableHead>
              <TableHead className="text-white text-center">권한</TableHead>
              <TableHead className="text-white text-center">상태</TableHead>
              <TableHead className="text-white text-center">이메일</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center">
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-6 text-center text-red-300"
                >
                  사용자 목록을 불러오지 못했습니다.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-6 text-center">
                  조회된 사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user.userId}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedUserId === user.userId}
                      onCheckedChange={(checked) =>
                        setSelectedUserId(checked ? user.userId : null)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {currentPage * USERS_PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.studentId}</TableCell>
                  <TableCell>
                    {user.role === "ADMIN" ? "관리자" : "사용자"}
                  </TableCell>
                  <TableCell>{user.state}</TableCell>
                  <TableCell>{user.email}</TableCell>
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
                    className={`border bg-black text-white hover:bg-neutral-800 hover:text-white ${currentPage === 0 ? "pointer-events-none opacity-50 border-neutral-700" : "cursor-pointer border-none"}`}
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
                      className={`cursor-pointer border text-white hover:bg-neutral-800 hover:text-white ${pageNumber === currentPage ? "bg-black border-white text-white" : "bg-transparent border-neutral-700 text-white"}`}
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
                    className={`border bg-black text-white hover:bg-neutral-800 hover:text-white ${currentPage >= totalPages - 1 ? "pointer-events-none opacity-50 border-neutral-700" : "cursor-pointer border-none"}`}
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

export default ManualRental;