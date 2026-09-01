import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useGenerateKitAssignments,
  useRegenerateKitAssignments,
  useCancelKitAssignments,
  useKitAssignments,
  useRentKitAssignments,
  useReturnKitAssignments,
} from "../../../api/ta.kitAssignment.api";
import type { KitAssignment, KitAssignmentSortBy } from "../../../type/ta.kitAssignmnet.type";
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
import { Checkbox } from "../../../components/ui/checkbox";
import { useMe } from "../../../api/user.api";

const KitOffering = () => {
  const { kitCourseOfferingId } = useParams();
  const courseOfferingId = Number(kitCourseOfferingId);
  const { data: me } = useMe();
  const operationListPath = me?.role === "ADMIN" ? "/admin/course-operations" : "/ta/kit-course-offering";

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [assignmentSortBy, setAssignmentSortBy] = useState<KitAssignmentSortBy>("STUDENT_ID");
  const [isRentDialogOpen, setIsRentDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState<number[]>(
    [],
  );

  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useKitAssignments(courseOfferingId);
  const { mutate: generateKitAssignments, isPending: isGenerating } =
    useGenerateKitAssignments();
  const { mutate: regenerateKitAssignments, isPending: isRegenerating } =
    useRegenerateKitAssignments();
  const { mutate: cancelKitAssignments, isPending: isCancelling } =
    useCancelKitAssignments();
  const { mutate: rentKitAssignments, isPending: isRenting } =
    useRentKitAssignments();
  const { mutate: returnKitAssignments, isPending: isReturning } =
    useReturnKitAssignments();

  const isInvalidCourseOfferingId =
    !Number.isFinite(courseOfferingId) || courseOfferingId <= 0;
  const isProcessing = isGenerating || isRegenerating || isCancelling || isRenting || isReturning;

  const selectedAssignmentIdSet = useMemo(
    () => new Set(selectedAssignmentIds),
    [selectedAssignmentIds],
  );
  const selectedAssignments = useMemo(
    () =>
      assignments.filter((assignment) =>
        selectedAssignmentIdSet.has(assignment.kitAssignmentId),
      ),
    [assignments, selectedAssignmentIdSet],
  );

  const selectedCount = selectedAssignments.length;
  const isAllSelected =
    assignments.length > 0 &&
    assignments.every((assignment) =>
      selectedAssignmentIdSet.has(assignment.kitAssignmentId),
    );
  const isSomeSelected = selectedCount > 0 && !isAllSelected;

  const normalizeStatus = (status?: string) =>
    status?.trim().toUpperCase() ?? "";

  const isRentableAssignment = (assignment: KitAssignment) =>
    normalizeStatus(assignment.status) === "ASSIGNED";
  const isReturnableAssignment = (assignment: KitAssignment) =>
    normalizeStatus(assignment.status) === "RENTED";
  const assignedCount = assignments.filter(isRentableAssignment).length;
  const rentedCount = assignments.filter(isReturnableAssignment).length;
  const returnedCount = assignments.filter(
    (assignment) => normalizeStatus(assignment.status) === "RETURNED",
  ).length;

  const formatDateTime = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("ko-KR");
  };

  const getStatusName = (status?: string) => {
    switch (normalizeStatus(status)) {
      case "ASSIGNED":
        return "배정됨";
      case "RESERVED":
        return "예약됨";
      case "RENTED":
        return "대여중";
      case "RETURNED":
        return "반납됨";
      case "CANCELED":
      case "CANCELLED":
        return "취소됨";
      default:
        return status || "-";
    }
  };

  const getStatusClassName = (status?: string) => {
    switch (normalizeStatus(status)) {
      case "ASSIGNED":
        return "text-blue-300 font-semibold";
      case "RESERVED":
        return "text-yellow-300 font-semibold";
      case "RENTED":
        return "text-green-300 font-semibold";
      case "RETURNED":
        return "text-gray-300 font-semibold";
      case "CANCELED":
      case "CANCELLED":
        return "text-red-300 font-semibold";
      default:
        return "text-gray-300 font-semibold";
    }
  };

  const handleSelectAssignment = (
    kitAssignmentId: number,
    checked: boolean,
  ) => {
    setSelectedAssignmentIds((prev) => {
      if (checked) return Array.from(new Set([...prev, kitAssignmentId]));
      return prev.filter((id) => id !== kitAssignmentId);
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssignmentIds(
        assignments
          .filter((assignment) => isRentableAssignment(assignment) || isReturnableAssignment(assignment))
          .map((assignment) => assignment.kitAssignmentId),
      );
      return;
    }

    setSelectedAssignmentIds([]);
  };

  const selectByStatus = (predicate: (assignment: KitAssignment) => boolean) => {
    setSelectedAssignmentIds(
      assignments.filter(predicate).map((assignment) => assignment.kitAssignmentId),
    );
  };

  const handleGenerateKitAssignments = () => {
    if (isInvalidCourseOfferingId) {
      toast.warning("잘못된 강의 운영 ID입니다.");
      return;
    }

    generateKitAssignments({ kitCourseOfferingId: courseOfferingId, sortBy: assignmentSortBy }, {
      onSuccess: () => {
        setIsGenerateDialogOpen(false);
      },
    });
  };

  const handleRegenerateKitAssignments = () => {
    regenerateKitAssignments(
      { kitCourseOfferingId: courseOfferingId, sortBy: assignmentSortBy },
      { onSuccess: () => { setSelectedAssignmentIds([]); setIsRegenerateDialogOpen(false); } },
    );
  };

  const handleCancelSelectedAssignments = () => {
    if (selectedAssignments.length === 0) return toast.warning("취소할 배정을 선택해주세요.");
    if (selectedAssignments.some((assignment) => !isRentableAssignment(assignment)))
      return toast.warning("대여 전 배정만 취소할 수 있습니다.");
    cancelKitAssignments(
      { kitCourseOfferingId: courseOfferingId, kitAssignmentIds: selectedAssignmentIds },
      { onSuccess: () => { setSelectedAssignmentIds([]); setIsCancelDialogOpen(false); } },
    );
  };

  const handleRentSelectedAssignments = () => {
    if (isInvalidCourseOfferingId) {
      toast.warning("잘못된 강의 운영 ID입니다.");
      return;
    }

    if (selectedAssignments.length === 0) {
      toast.warning("대여 처리할 학생을 선택해주세요.");
      return;
    }

    if (
      selectedAssignments.some(
        (assignment) => !isRentableAssignment(assignment),
      )
    ) {
      toast.warning("대여 처리는 배정됨 상태의 KIT만 가능합니다.");
      return;
    }

    rentKitAssignments(
      {
        kitCourseOfferingId: courseOfferingId,
        kitAssignmentIds: selectedAssignments.map(
          (assignment) => assignment.kitAssignmentId,
        ),
      },
      {
        onSuccess: () => {
          setSelectedAssignmentIds([]);
          setIsRentDialogOpen(false);
        },
      },
    );
  };

  const handleReturnSelectedAssignments = () => {
    if (isInvalidCourseOfferingId) {
      toast.warning("잘못된 강의 운영 ID입니다.");
      return;
    }

    if (selectedAssignments.length === 0) {
      toast.warning("반납 처리할 학생을 선택해주세요.");
      return;
    }

    if (
      selectedAssignments.some(
        (assignment) => !isReturnableAssignment(assignment),
      )
    ) {
      toast.warning("반납 처리는 대여중 상태의 KIT만 가능합니다.");
      return;
    }

    returnKitAssignments(
      {
        kitCourseOfferingId: courseOfferingId,
        kitAssignmentIds: selectedAssignments.map(
          (assignment) => assignment.kitAssignmentId,
        ),
      },
      {
        onSuccess: () => {
          setSelectedAssignmentIds([]);
          setIsReturnDialogOpen(false);
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#060a0c] w-screen px-8 text-white">
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
                href={operationListPath}
              >
                조교
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">키트 관리</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">KIT 배정 목록</h1>
            <p className="mt-2 text-sm text-gray-400">
              선택한 KIT 강의 운영의 전체 키트 배정 목록입니다.
            </p>
          </div>

          <div className="flex max-w-5xl flex-wrap items-center justify-end gap-2">
            <label className="flex items-center gap-2 rounded-sm border border-neutral-600 px-3 py-1 text-sm">
              <span className="text-neutral-400">배정 기준</span>
              <select
                value={assignmentSortBy}
                disabled={isProcessing}
                onChange={(event) => setAssignmentSortBy(event.target.value as KitAssignmentSortBy)}
                className="bg-transparent text-white outline-none disabled:text-neutral-600"
              >
                <option value="STUDENT_ID" className="bg-neutral-900">학번순</option>
                <option value="NAME" className="bg-neutral-900">이름순</option>
              </select>
            </label>
            <button
              type="button"
              disabled={isProcessing || assignedCount === 0}
              onClick={() => selectByStatus(isRentableAssignment)}
              className="border cursor-pointer px-3 py-1 rounded-sm border-neutral-600 text-sm disabled:cursor-not-allowed disabled:text-neutral-600"
            >
              배정됨 전체 선택
            </button>
            <button
              type="button"
              disabled={isProcessing || rentedCount === 0}
              onClick={() => selectByStatus(isReturnableAssignment)}
              className="border cursor-pointer px-3 py-1 rounded-sm border-neutral-600 text-sm disabled:cursor-not-allowed disabled:text-neutral-600"
            >
              대여중 전체 선택
            </button>
            <AlertDialog
              open={isGenerateDialogOpen}
              onOpenChange={(open) => {
                if (isGenerating) return;
                setIsGenerateDialogOpen(open);
              }}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={isInvalidCourseOfferingId || isProcessing}
                  className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
                >
                  자동 배정
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>KIT 자동 배정</AlertDialogTitle>
                  <AlertDialogDescription>
                    미배정 학생에게 {assignmentSortBy === "STUDENT_ID" ? "학번순" : "이름순(동명이인은 학번순)"}으로
                    사용 가능한 KIT를 배정합니다.
                    <br />
                    이미 배정된 학생은 기존 배정이 유지됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isGenerating}
                  >
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    disabled={isGenerating}
                    onClick={(event) => {
                      event.preventDefault();
                      handleGenerateKitAssignments();
                    }}
                  >
                    {isGenerating ? "배정 중..." : "자동 배정"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isRegenerateDialogOpen} onOpenChange={(open) => !isRegenerating && setIsRegenerateDialogOpen(open)}>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={isInvalidCourseOfferingId || isProcessing || assignments.length === 0}
                  className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
                >
                  전체 재배정
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>KIT 전체 재배정</AlertDialogTitle>
                  <AlertDialogDescription>
                    모든 대여 전 배정을 회수하고 최종 명단을 {assignmentSortBy === "STUDENT_ID" ? "학번순" : "이름순(동명이인은 학번순)"}으로 정렬하여 MP-001부터 다시 배정합니다.
                    <br />대여·반납 이력이 하나라도 있으면 안전을 위해 실행되지 않습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isRegenerating}>취소</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isRegenerating}
                    onClick={(event) => { event.preventDefault(); handleRegenerateKitAssignments(); }}
                  >
                    {isRegenerating ? "재배정 중..." : "전체 재배정"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isCancelDialogOpen} onOpenChange={(open) => !isCancelling && setIsCancelDialogOpen(open)}>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={isProcessing || selectedCount === 0}
                  className="border cursor-pointer px-3 py-1 rounded-sm border-red-500/70 text-red-300 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:border-neutral-700 disabled:text-neutral-600"
                >
                  선택 배정 취소
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>선택한 배정 취소</AlertDialogTitle>
                  <AlertDialogDescription>
                    선택한 {selectedCount}건의 대여 전 배정을 취소합니다. 해당 KIT는 즉시 사용 가능 상태로 돌아갑니다.
                    <br />대여 중이거나 반납 완료된 항목이 포함되면 전체 요청이 취소됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isCancelling}>닫기</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isCancelling}
                    onClick={(event) => { event.preventDefault(); handleCancelSelectedAssignments(); }}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {isCancelling ? "취소 처리 중..." : "배정 취소"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={isRentDialogOpen}
              onOpenChange={(open) => {
                if (isRenting) return;
                setIsRentDialogOpen(open);
              }}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={
                    isInvalidCourseOfferingId ||
                    isProcessing ||
                    selectedCount === 0
                  }
                  className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
                >
                  대여
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>KIT 대여 처리</AlertDialogTitle>
                  <AlertDialogDescription>
                    선택한 {selectedCount}명의 KIT 배정을 실제 대여
                    처리하시겠습니까?
                    <br />
                    배정됨 상태의 KIT만 대여 처리할 수 있습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isRenting}
                  >
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    disabled={isRenting}
                    onClick={(event) => {
                      event.preventDefault();
                      handleRentSelectedAssignments();
                    }}
                  >
                    {isRenting ? "대여 처리 중..." : "대여 처리"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={isReturnDialogOpen}
              onOpenChange={(open) => {
                if (isReturning) return;
                setIsReturnDialogOpen(open);
              }}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={
                    isInvalidCourseOfferingId ||
                    isProcessing ||
                    selectedCount === 0
                  }
                  className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
                >
                  반납
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>KIT 반납 처리</AlertDialogTitle>
                  <AlertDialogDescription>
                    선택한 {selectedCount}명의 KIT를 반납 처리하시겠습니까?
                    <br />
                    대여중 상태의 KIT만 반납 처리할 수 있습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isReturning}
                  >
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    disabled={isReturning}
                    onClick={(event) => {
                      event.preventDefault();
                      handleReturnSelectedAssignments();
                    }}
                  >
                    {isReturning ? "반납 처리 중..." : "반납 처리"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3">
          {[
            ["전체 배정", assignments.length],
            ["배부 대기", assignedCount],
            ["대여 중", rentedCount],
            ["반납 완료", returnedCount],
          ].map(([label, count]) => (
            <div key={label} className="border border-neutral-700 bg-[#0d1117] px-5 py-4">
              <p className="text-xs text-neutral-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{count}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableRow>
                <TableHead className="text-white text-center w-12">
                    <Checkbox
                      checked={
                        isAllSelected
                          ? true
                          : isSomeSelected
                            ? "indeterminate"
                            : false
                      }
                      disabled={
                        isInvalidCourseOfferingId ||
                        isProcessing ||
                        assignments.length === 0
                      }
                      onCheckedChange={(checked) =>
                        handleSelectAll(checked === true)
                      }
                      aria-label="전체 수강생 선택"
                    />
                </TableHead>
                <TableHead className="text-white text-center">이름</TableHead>
                <TableHead className="text-white text-center">학번</TableHead>
                <TableHead className="text-white text-center">
                  KIT 시리얼
                </TableHead>
                <TableHead className="text-white text-center">
                  배정 상태
                </TableHead>
                <TableHead className="text-white text-center">배정일</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isInvalidCourseOfferingId ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-red-400"
                  >
                    잘못된 강의 운영 ID입니다.
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-300"
                  >
                    KIT 배정 목록을 불러오는 중입니다.
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-red-400"
                  >
                    {error instanceof Error
                      ? error.message
                      : "KIT 배정 목록 조회 중 오류가 발생했습니다."}
                  </TableCell>
                </TableRow>
              ) : assignments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-400"
                  >
                    조회된 KIT 배정 정보가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment.kitAssignmentId}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAssignmentIdSet.has(
                          assignment.kitAssignmentId,
                        )}
                        disabled={isProcessing}
                        onCheckedChange={(checked) =>
                          handleSelectAssignment(
                            assignment.kitAssignmentId,
                            checked === true,
                          )
                        }
                        aria-label={`${assignment.username} 선택`}
                      />
                    </TableCell>
                    <TableCell>{assignment.username}</TableCell>
                    <TableCell>{assignment.studentId}</TableCell>
                    <TableCell>{assignment.serial}</TableCell>
                    <TableCell>
                      <span className={getStatusClassName(assignment.status)}>
                        {getStatusName(assignment.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDateTime(assignment.assignedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default KitOffering;
