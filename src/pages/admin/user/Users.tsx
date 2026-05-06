import { useMemo, useState, useEffect } from "react";
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
import { RoleCombobox } from "../../../components/ui/RoleCombobox";
import { StateCombobox } from "../../../components/ui/StateCombobox";
import { toast } from "sonner";
import { Label } from "../../../components/ui/label";
import { useAdminUsers, useUserUpdate, useDeleteUser } from "../../../api/admin.api";
import { useRegisterExcel } from "../../../api/adminUser.api";
import { useAcademicTerms } from "../../../api/academicTerm.api";

const Users = () => {
  const navigte = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<"ADMIN" | "USER">("ADMIN");
  const [editState, setEditState] = useState<"ACTIVE" | "BANNED">("ACTIVE");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [excelDialogOpen, setExcelDialogOpen] = useState(false);
  const [excelTermId, setExcelTermId] = useState("");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelPreviewData, setExcelPreviewData] = useState<unknown>(null);
  const [page, setPage] = useState(0);
  const size = 10;
  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "";
  
    const digits = phone.replace(/\D/g, "");
  
    if (digits.length === 11) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    }
  
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  
    return phone;
  };

  const formatAcademicTermLabel = (term: {
    year: number;
    term: string;
    active: boolean;
  }) => {
    const semesterText = term.term === "SPRING" ? "1학기" : "2학기";
    return `${term.year}-${semesterText}${term.active ? " (현재 학기)" : ""}`;
  };

  const { mutateAsync: registerExcel, isPending: isRegisteringExcel } =
    useRegisterExcel();
  
  const { data: academicTerms = [], isLoading: isAcademicTermsLoading } =
    useAcademicTerms();

  const { mutate: updateUser, isPending: isUpdating } = useUserUpdate();
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUser();

  const [checkedRoles, setCheckedRoles] = useState({
    ADMIN: true,
    USER: true,
  });
  const [checkedStates, setCheckedStates] = useState({
    ACTIVE: true,
    BANNED: true,
  });

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
    page,
    size,
    sort: "",
  });

  const users = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = page;
  const selectedUser =
    users.find((user) => user.userId === selectedUserId) ?? null;

  useEffect(() => {
    setPage(0);
  }, [rolesParam, statesParam, keyword]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) return [];

    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    );
  }, [currentPage, totalPages]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || nextPage >= totalPages || nextPage === currentPage)
      return;
    setPage(nextPage);
    setSelectedUserId(null);
  };

  useEffect(() => {
    if (!selectedUser) return;

    setEditRole(selectedUser.role);
    setEditState(selectedUser.state);
    setEditEmail(selectedUser.email);
    setEditPhone(selectedUser.phone);
  }, [selectedUser]);

  useEffect(() => {
    if (!academicTerms.length) return;
    if (excelTermId) return;
  
    const activeTerm = academicTerms.find((term) => term.active);
    if (activeTerm) {
      setExcelTermId(String(activeTerm.id));
    }
  }, [academicTerms, excelTermId]);

  const handleUpdateUser = () => {
    if (!selectedUser) {
      toast("수정할 사용자를 선택해주세요.");
      return;
    }

    updateUser(
      {
        userId: selectedUser.userId,
        role: editRole,
        state: editState,
        email: editEmail,
        phone: editPhone,
      },
      {
        onSuccess: () => {
          toast("해당 사용자의 정보가 수정되었습니다.");
          setIsEditDialogOpen(false);
        },
        onError: () => {
          toast("사용자 정보 수정에 실패했습니다.");
        },
      },
    );
  };

  const handleDeleteUser = () => {
    if (!selectedUser) {
      toast("삭제할 사용자를 선택해주세요.");
      return;
    }
  
    deleteUser(selectedUser.userId, {
      onSuccess: () => {
        toast("해당 사용자가 삭제되었습니다.");
        setSelectedUserId(null);
      },
      onError: () => {
        toast("사용자 삭제에 실패했습니다.");
      },
    });
  };

  const resetExcelForm = () => {
    setExcelTermId("");
    setExcelFile(null);
    setExcelPreviewData(null);
  };

  const handleExcelPreview = async () => {
    if (!excelTermId.trim()) {
      toast.error("학기를 선택해주세요.");
      return;
    }

    if (!excelFile) {
      toast.error("엑셀 파일을 선택해주세요.");
      return;
    }

    try {
      const res = await registerExcel({
        termId: Number(excelTermId),
        isConfirm: false,
        file: excelFile,
      });
      setExcelPreviewData(res);
      toast.success("엑셀 미리보기를 불러왔습니다.");
    } catch (error) {
      console.error(error);
      toast.error("엑셀 미리보기에 실패했습니다.");
    }
  };

  const handleExcelConfirm = async () => {
    if (!excelTermId.trim()) {
      toast.error("학기를 선택해주세요.");
      return;
    }

    if (!excelFile) {
      toast.error("엑셀 파일을 선택해주세요.");
      return;
    }

    try {
      await registerExcel({
        termId: Number(excelTermId),
        isConfirm: true,
        file: excelFile,
      });
      toast.success("학생 정보가 일괄 등록되었습니다.");
      resetExcelForm();
      setExcelDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("학생 정보 일괄 등록에 실패했습니다.");
    }
  };

  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white">
      {/* 브래드크럼 */}
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
                사용자 관리
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 제목 */}
      <div className="pt-8 pb-4">
        <div className="font-bold text-white text-3xl pb-4">사용자 관리</div>
      </div>
      {/* 검색창 & 수정 버튼 */}
      <div className="flex justify-between items-center pr-2">
        {/* 검색창 */}
        <div className="relative w-3/5 md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3 h-3 md:w-5 md:h-5" />
          <Input
            placeholder="학번 또는 이름을 입력해주세요."
            className="border-neutral-400 pl-8 md:pl-10 text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          {/* todo : 엑셀 일괄 등록 */}
          <AlertDialog open={excelDialogOpen} onOpenChange={setExcelDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="border px-3 py-1 rounded-sm hover:bg-neutral-800 cursor-pointer border-neutral-400 text-neutral-200 text-sm"
              >
                일괄 등록
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>학생 정보 엑셀 일괄 등록</AlertDialogTitle>
                <AlertDialogDescription>
                  엑셀 파일을 업로드한 뒤 미리보기로 내용을 확인하고 최종 등록할
                  수 있습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4 pt-4">
              <div>
                <Label className="pb-2">학기 선택</Label>
                <select
                  value={excelTermId}
                  onChange={(e) => setExcelTermId(e.target.value)}
                  disabled={isAcademicTermsLoading}
                  className="w-full rounded-md border border-neutral-400 bg-[#060a0c] px-3 py-2 text-sm text-white"
                >
                  <option value="">
                    {isAcademicTermsLoading ? "학기 불러오는 중..." : "학기를 선택해주세요."}
                  </option>
                  {academicTerms.map((term) => (
                    <option key={term.id} value={term.id}>
                      {formatAcademicTermLabel(term)}
                    </option>
                  ))}
                </select>
              </div>
                <div>
                  <Label className="pb-2">엑셀 파일</Label>
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                {excelPreviewData ? (
                  <div className="max-h-60 overflow-auto rounded-sm border border-neutral-700 bg-neutral-950 p-3 text-xs text-neutral-200">
                    <pre>{JSON.stringify(excelPreviewData, null, 2)}</pre>
                  </div>
                ) : null}
              </div>

              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel
                  className="cursor-pointer"
                  disabled={isRegisteringExcel}
                  onClick={resetExcelForm}
                >
                  취소
                </AlertDialogCancel>

                <button
                  type="button"
                  disabled={isRegisteringExcel}
                  onClick={handleExcelPreview}
                  className="border px-4 py-2 rounded-sm hover:bg-neutral-700 bg-neutral-900 border-neutral-400 text-neutral-200 text-sm disabled:cursor-not-allowed disabled:border-neutral-700 disabled:text-neutral-600"
                >
                  {isRegisteringExcel ? "처리 중..." : "미리보기"}
                </button>

                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    void handleExcelConfirm();
                  }}
                  disabled={isRegisteringExcel || !excelPreviewData}
                  className="bg-neutral-900 hover:bg-neutral-700 font-bold cursor-pointer disabled:cursor-not-allowed"
                >
                  최종 등록
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* 수정 버튼 */}
          <div>
            <AlertDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={!selectedUser}
                  className={`border text-sm px-3 py-1 rounded-sm ${
                    selectedUser
                      ? "hover:bg-neutral-800 cursor-pointer border-neutral-400 text-neutral-200"
                      : "cursor-not-allowed border-neutral-700 text-neutral-600"
                  }`}
                >
                  수정
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {`#${selectedUser?.userId} ${selectedUser?.username}`}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    사용자 정보를 수정해보세요.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                {/* 수정 모달 테이블 */}
                <div>
                  <Table className="text-center border border-neutral-200">
                    <TableBody>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          아이디
                        </TableCell>
                        <TableCell className="text-left px-6">
                          {selectedUser?.userId}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          이름
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input
                            className="text-sm"
                            value={selectedUser?.username}
                            readOnly
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          학번
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input
                            className="text-sm"
                            value={selectedUser?.studentId}
                            readOnly
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          권한
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <RoleCombobox
                            value={editRole}
                            onChange={(value) =>
                              setEditRole(value as "ADMIN" | "USER")
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          상태
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <StateCombobox
                            value={editState}
                            onChange={(value) =>
                              setEditState(value as "ACTIVE" | "BANNED")
                            }
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          이메일
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input
                            className="text-sm"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          연락처
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input
                            className="text-sm"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
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
                    onClick={handleUpdateUser}
                    disabled={!selectedUser || isUpdating}
                    className="hover:bg-neutral-700 font-bold cursor-pointer"
                  >
                    {isUpdating ? "수정 중..." : "수정"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {/* 삭제 버튼 */}
          <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    disabled={!selectedUser}
                    className={`border px-3 py-1 rounded-sm text-sm ${
                      selectedUser
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
                      {selectedUser
                        ? `#${selectedUser.userId} ${selectedUser.username}을(를) 삭제하시겠습니까?`
                        : "삭제할 사용자를 선택해주세요."}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {selectedUser
                        ? "사용자를 삭제하면 되돌릴 수 없습니다."
                        : "테이블에서 삭제할 사용자를 선택해주세요."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel className="cursor-pointer">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteUser}
                      disabled={!selectedUser || isDeletingUser}
                      className="bg-red-600 hover:bg-red-500 font-bold cursor-pointer"
                    >
                      {isDeletingUser ? "삭제 중..." : "삭제"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
        </div>
      </div>
      {/* 권한 체크박스 */}
      <div className="flex items-center space-x-4 py-4">
        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedRoles.ADMIN}
            onCheckedChange={(checked) =>
              setCheckedRoles((prev) => ({
                ...prev,
                ADMIN: checked === true,
              }))
            }
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">관리자</p>
        </Label>

        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedRoles.USER}
            onCheckedChange={(checked) =>
              setCheckedRoles((prev) => ({
                ...prev,
                USER: checked === true,
              }))
            }
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">사용자</p>
        </Label>
      </div>

      {/* 상태 체크박스 */}
      <div className="flex items-center space-x-4 pb-4">
        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedStates.ACTIVE}
            onCheckedChange={(checked) =>
              setCheckedStates((prev) => ({
                ...prev,
                ACTIVE: checked === true,
              }))
            }
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">ACTIVE</p>
        </Label>

        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedStates.BANNED}
            onCheckedChange={(checked) =>
              setCheckedStates((prev) => ({
                ...prev,
                BANNED: checked === true,
              }))
            }
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">BANNED</p>
        </Label>
      </div>

      {/* 사용자 테이블 */}
      <div className="mt-4">
        <Table className="text-white text-center border border-neutral-700">
          <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableHead></TableHead>
            <TableHead className="text-white text-center">ID</TableHead>
            <TableHead className="text-white text-center">이름</TableHead>
            <TableHead className="text-white text-center">학번</TableHead>
            <TableHead className="text-white text-center">권한</TableHead>
            <TableHead className="text-white text-center">상태</TableHead>
            <TableHead className="text-white text-center">이메일</TableHead>
            <TableHead className="text-white text-center">연락처</TableHead>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center">
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-6 text-center text-red-300"
                >
                  사용자 목록을 불러오지 못했습니다.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center">
                  조회된 사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.userId}
                  className="cursor-pointer"
                  onClick={() => navigte(`/admin/users/${user.userId}`)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedUserId === user.userId}
                      onCheckedChange={(checked) => {
                        setSelectedUserId(checked ? user.userId : null);
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.studentId}</TableCell>
                  <TableCell>
                    {user.role === "ADMIN" ? "관리자" : "사용자"}
                  </TableCell>
                  <TableCell>{user.state}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatPhoneNumber(user.phone)}</TableCell>
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

export default Users;
