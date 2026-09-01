import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCourseEnrollments,
  useCreateGuestEnrollment,
  useCreateInternalEnrollment,
  useCompareEnrollmentsExcel,
  useSyncEnrollmentsExcel,
  useDropEnrollments,
} from "../../../api/ta.kitEnrollment.api";
import type { EnrollmentSyncPreview } from "../../../type/ta.kitEnrollment.type";
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
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { useMe } from "../../../api/user.api";
import { FileSpreadsheet, UserPlus, Users } from "lucide-react";

const Students = () => {
  const { kitCourseOfferingId } = useParams();
  const courseOfferingId = Number(kitCourseOfferingId);
  const { data: me } = useMe();
  const operationListPath = me?.role === "ADMIN" ? "/admin/course-operations" : "/ta/kit-course-offering";

  const [isSelectTypeDialogOpen, setIsSelectTypeDialogOpen] = useState(false);
  const [isInternalDialogOpen, setIsInternalDialogOpen] = useState(false);
  const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [isDropDialogOpen, setIsDropDialogOpen] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [excelResult, setExcelResult] = useState<EnrollmentSyncPreview | null>(null);
  const [guestUsername, setGuestUsername] = useState("");
  const [guestStudentId, setGuestStudentId] = useState("");
  const [guestDepartmentName, setGuestDepartmentName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [selectedEnrollmentIds, setSelectedEnrollmentIds] = useState<number[]>(
    [],
  );

  const {
    data: enrollments = [],
    isLoading,
    isError,
  } = useCourseEnrollments(courseOfferingId);
  const { mutate: createInternalEnrollment, isPending: isCreatingInternal } =
    useCreateInternalEnrollment();
  const { mutate: createGuestEnrollment, isPending: isCreatingGuest } =
    useCreateGuestEnrollment();
  const { mutate: compareEnrollmentsExcel, isPending: isComparingExcel } =
    useCompareEnrollmentsExcel();
  const { mutate: syncEnrollmentsExcel, isPending: isSyncingExcel } =
    useSyncEnrollmentsExcel();
  const isCreatingBatch = isComparingExcel || isSyncingExcel;
  const { mutate: dropEnrollments, isPending: isDropping } =
    useDropEnrollments();

  const ROLE_NAME_MAP: Record<string, string> = {
    GUEST: "타과 학생",
    USER: "사용자",
    ADMIN: "관리자",
    TA: "조교",
  };

  const isInvalidCourseOfferingId =
    !Number.isFinite(courseOfferingId) || courseOfferingId <= 0;
  const isAllSelected =
    enrollments.length > 0 &&
    enrollments.every((student) =>
      selectedEnrollmentIds.includes(student.enrollmentId),
    );
  const isSomeSelected = selectedEnrollmentIds.length > 0 && !isAllSelected;

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR");
  };

  const resetInternalForm = () => {
    setStudentId("");
  };

  const resetGuestForm = () => {
    setGuestUsername("");
    setGuestStudentId("");
    setGuestDepartmentName("");
    setGuestEmail("");
  };

  const handleOpenInternalDialog = () => {
    setIsSelectTypeDialogOpen(false);
    setIsInternalDialogOpen(true);
  };

  const handleOpenGuestDialog = () => {
    setIsSelectTypeDialogOpen(false);
    setIsGuestDialogOpen(true);
  };

  const handleOpenBatchDialog = () => {
    setIsSelectTypeDialogOpen(false);
    setExcelFile(null);
    setExcelResult(null);
    setIsBatchDialogOpen(true);
  };

  const handleCompareExcel = () => {
    if (!excelFile) {
      toast.warning("수강생 엑셀 파일을 선택해주세요.");
      return;
    }
    compareEnrollmentsExcel(
      { kitCourseOfferingId: courseOfferingId, file: excelFile },
      { onSuccess: (response) => setExcelResult(response.data) },
    );
  };

  const handleSyncExcel = () => {
    if (!excelFile || !excelResult) {
      toast.warning("명단 비교를 먼저 실행해주세요.");
      return;
    }
    syncEnrollmentsExcel(
      {
        kitCourseOfferingId: courseOfferingId,
        file: excelFile,
        checksum: excelResult.checksum,
      },
      {
        onSuccess: () => {
          setIsBatchDialogOpen(false);
          setExcelFile(null);
          setExcelResult(null);
        },
      },
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEnrollmentIds(
        enrollments.map((student) => student.enrollmentId),
      );
      return;
    }

    setSelectedEnrollmentIds([]);
  };

  const handleSelectEnrollment = (enrollmentId: number, checked: boolean) => {
    setSelectedEnrollmentIds((previousIds) => {
      if (checked)
        return previousIds.includes(enrollmentId)
          ? previousIds
          : [...previousIds, enrollmentId];
      return previousIds.filter((id) => id !== enrollmentId);
    });
  };

  const handleCreateInternalEnrollment = () => {
    if (isInvalidCourseOfferingId) {
      toast.warning("잘못된 강의 운영 ID입니다.");
      return;
    }

    if (!studentId.trim()) {
      toast.warning("학번을 입력해주세요.");
      return;
    }

    createInternalEnrollment(
      {
        kitCourseOfferingId: courseOfferingId,
        request: { studentId: studentId.trim() },
      },
      {
        onSuccess: () => {
          resetInternalForm();
          setIsInternalDialogOpen(false);
        },
      },
    );
  };

  const handleCreateGuestEnrollment = () => {
    if (isInvalidCourseOfferingId) {
      toast.warning("잘못된 강의 운영 ID입니다.");
      return;
    }

    if (!guestUsername.trim()) {
      toast.warning("이름을 입력해주세요.");
      return;
    }

    if (!guestStudentId.trim()) {
      toast.warning("학번을 입력해주세요.");
      return;
    }

    if (!guestDepartmentName.trim()) {
      toast.warning("학과를 입력해주세요.");
      return;
    }

    if (!guestEmail.trim()) {
      toast.warning("이메일을 입력해주세요.");
      return;
    }

    createGuestEnrollment(
      {
        kitCourseOfferingId: courseOfferingId,
        request: {
          username: guestUsername.trim(),
          studentId: guestStudentId.trim(),
          departmentName: guestDepartmentName.trim(),
          email: guestEmail.trim(),
        },
      },
      {
        onSuccess: () => {
          resetGuestForm();
          setIsGuestDialogOpen(false);
        },
      },
    );
  };

  const handleDropEnrollments = () => {
    if (isInvalidCourseOfferingId) {
      toast.warning("잘못된 강의 운영 ID입니다.");
      return;
    }

    if (selectedEnrollmentIds.length === 0) {
      toast.warning("Drop 처리할 수강생을 선택해주세요.");
      return;
    }

    dropEnrollments(
      {
        kitCourseOfferingId: courseOfferingId,
        kitEnrollmentIds: selectedEnrollmentIds,
      },
      {
        onSuccess: () => {
          setSelectedEnrollmentIds([]);
          setIsDropDialogOpen(false);
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
              <BreadcrumbPage className="text-white">
                수강생 관리
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">수강생 관리</h1>
            <p className="mt-2 text-sm text-gray-400">
              선택한 KIT 강의 운영의 수강생 목록입니다.
            </p>
          </div>

          <div className="flex gap-3">
            <AlertDialog
              open={isSelectTypeDialogOpen}
              onOpenChange={setIsSelectTypeDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={isInvalidCourseOfferingId}
                  className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
                >
                  추가
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="sm:max-w-4xl p-8">
                <AlertDialogHeader>
                  <AlertDialogTitle>수강생 추가</AlertDialogTitle>
                  <AlertDialogDescription>
                    추가할 학생 종류를 선택해주세요.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid gap-3 pt-4">
                  <button
                    type="button"
                    className="group flex min-h-28 w-full items-center gap-5 rounded-xl border border-neutral-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md"
                    onClick={handleOpenInternalDialog}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                      <UserPlus className="h-6 w-6 text-neutral-600" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold text-neutral-950">내부 학생 직접 추가</span>
                      <span className="mt-1 block break-keep text-sm leading-6 text-neutral-500">예외 인원을 학번으로 찾아 한 명씩 등록합니다.</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="group flex min-h-28 w-full items-center gap-5 rounded-xl border-2 border-emerald-600 bg-emerald-50 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    onClick={handleOpenBatchDialog}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                      <FileSpreadsheet className="h-6 w-6 text-emerald-700" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-lg font-semibold text-neutral-950">
                        엑셀 명단 등록
                        <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-medium text-white">권장</span>
                      </span>
                      <span className="mt-1 block break-keep text-sm leading-6 text-neutral-600">수강생현황 파일을 올리면 내부 학생과 타과생을 자동으로 구분해 일괄 등록합니다.</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    className="group flex min-h-28 w-full items-center gap-5 rounded-xl border border-neutral-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-md"
                    onClick={handleOpenGuestDialog}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                      <Users className="h-6 w-6 text-neutral-600" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold text-neutral-950">게스트 직접 추가</span>
                      <span className="mt-1 block break-keep text-sm leading-6 text-neutral-500">엑셀에서 누락된 타과생 정보를 직접 등록합니다.</span>
                    </span>
                  </button>
                </div>

                <AlertDialogFooter className="pt-8">
                  <AlertDialogCancel className="cursor-pointer">
                    취소
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isBatchDialogOpen} onOpenChange={(open) => {
              if (isCreatingBatch) return;
              setIsBatchDialogOpen(open);
              if (!open) { setExcelFile(null); setExcelResult(null); }
            }}>
              <AlertDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl p-8">
                <AlertDialogHeader>
                  <AlertDialogTitle>수강생 엑셀 명단 등록</AlertDialogTitle>
                  <AlertDialogDescription>
                    수강생현황 엑셀의 이름·학번·소속 열을 읽습니다. 가입 학생은 내부 학생으로, 미가입 학생은 타과생 GUEST로 자동 등록합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <label
                  className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 text-center hover:border-emerald-600 hover:bg-emerald-50"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const file = event.dataTransfer.files?.[0] ?? null;
                    if (file && !/\.(xlsx|xls)$/i.test(file.name)) {
                      toast.warning("xlsx 또는 xls 파일만 업로드할 수 있습니다.");
                      return;
                    }
                    setExcelFile(file);
                    setExcelResult(null);
                  }}
                >
                  <FileSpreadsheet className="mb-3 h-9 w-9 text-emerald-700" />
                  <span className="font-semibold text-neutral-900">{excelFile ? excelFile.name : "엑셀 파일을 선택하거나 이곳에 놓으세요"}</span>
                  <span className="mt-2 text-sm text-neutral-500">.xlsx 또는 .xls · 최대 10MB</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="sr-only"
                    disabled={isCreatingBatch}
                    onChange={(event) => {
                      setExcelFile(event.target.files?.[0] ?? null);
                      setExcelResult(null);
                    }}
                  />
                </label>
                {excelResult && (
                  <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-neutral-950">명단 비교 결과</p>
                        <p className="mt-1 text-sm text-neutral-500">아직 서버 데이터는 변경되지 않았습니다.</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">비교 완료</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                      {[
                        ["엑셀 인원", excelResult.excelStudentCount, "text-neutral-950"],
                        ["유지", excelResult.maintainedCount, "text-blue-700"],
                        ["신규", excelResult.newCount, "text-emerald-700"],
                        ["재등록", excelResult.restoredCount, "text-violet-700"],
                        ["취소 예정", excelResult.droppedCount, "text-orange-700"],
                        ["반납 필요", excelResult.rentalBlockedCount, "text-red-700"],
                        ["오류", excelResult.failedCount, "text-red-700"],
                      ].map(([label, value, color]) => (
                        <div key={label} className="rounded-lg bg-white p-3 text-center shadow-sm">
                          <div className={`text-xl font-bold ${color}`}>{value}</div>
                          <div className="mt-1 text-xs text-neutral-500">{label}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm leading-6 text-neutral-600">
                      내부 학생 {excelResult.internalStudentCount}명 · 타과생 {excelResult.guestStudentCount}명입니다.
                      신규·재등록·취소 예정 내역을 확인한 뒤에만 동기화를 적용해주세요.
                    </p>
                    {[
                      ["신규 등록", excelResult.newStudents, "text-emerald-700"],
                      ["재등록", excelResult.restoredStudents, "text-violet-700"],
                      ["수강 취소 예정", excelResult.droppedStudents, "text-orange-700"],
                      ["반납 필요 — 자동 취소 안 됨", excelResult.rentalBlockedStudents, "text-red-700"],
                    ].map(([title, students, color]) => {
                      const studentList = students as EnrollmentSyncPreview["newStudents"];
                      if (studentList.length === 0) return null;
                      return (
                        <details key={title as string} className="rounded-lg border bg-white">
                          <summary className={`cursor-pointer px-4 py-3 text-sm font-semibold ${color}`}>
                            {title as string} {studentList.length}명
                          </summary>
                          <div className="max-h-40 overflow-auto border-t">
                            {studentList.map((student) => (
                              <div key={student.studentId} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-4 py-2 text-sm last:border-b-0">
                                <span className="font-medium text-neutral-950">{student.username}</span>
                                <span className="text-neutral-500">{student.studentId}</span>
                                <span className="text-neutral-500">{student.departmentName || "소속 미입력"}</span>
                                {student.kitSerial && <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs">{student.kitSerial}</span>}
                                {student.note && <span className="ml-auto text-xs text-neutral-500">{student.note}</span>}
                              </div>
                            ))}
                          </div>
                        </details>
                      );
                    })}
                    {excelResult.failures.length > 0 && (
                      <details className="rounded-lg border border-red-200 bg-white">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-red-700">확인 필요한 오류 {excelResult.failures.length}건</summary>
                        <div className="max-h-40 overflow-auto border-t border-red-100">
                          {excelResult.failures.map((failure) => (
                            <div key={`${failure.rowNumber}-${failure.studentId}`} className="border-b px-4 py-2 text-sm last:border-b-0">
                              <span className="font-medium">{failure.rowNumber}행 · {failure.studentId || "학번 없음"} {failure.username}</span>
                              <span className="ml-2 text-red-600">{failure.reason}</span>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                    {(excelResult.droppedCount > 0 || excelResult.rentalBlockedCount > 0) && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                        동기화하면 최신 엑셀에서 사라진 학생은 수강 취소됩니다. 배정만 된 KIT는 자동 해제되지만, 대여 중인 학생은 반납 전까지 그대로 유지됩니다.
                      </div>
                    )}
                  </div>
                )}
                <AlertDialogFooter className="items-center">
                  <AlertDialogCancel disabled={isCreatingBatch}>닫기</AlertDialogCancel>
                  <button
                    type="button"
                    className="h-9 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-900 hover:bg-neutral-100 disabled:opacity-50"
                    disabled={isCreatingBatch || !excelFile}
                    onClick={handleCompareExcel}
                  >
                    {isComparingExcel ? "비교 중..." : excelResult ? "다시 비교" : "명단 비교"}
                  </button>
                  <AlertDialogAction
                    className="bg-emerald-700 text-white hover:bg-emerald-800"
                    disabled={isCreatingBatch || !excelResult || excelResult.failedCount > 0}
                    onClick={(event) => { event.preventDefault(); handleSyncExcel(); }}
                  >
                    {isSyncingExcel ? "동기화 중..." : "동기화 적용"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={isDropDialogOpen}
              onOpenChange={(open) => {
                if (isDropping) return;
                setIsDropDialogOpen(open);
              }}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={selectedEnrollmentIds.length === 0}
                  className="border cursor-pointer px-3 py-1 rounded-sm border-red-500 text-red-400 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
                >
                  수강 취소
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>수강생 제외 및 KIT 배정 취소</AlertDialogTitle>
                  <AlertDialogDescription>
                    선택한 {selectedEnrollmentIds.length}명을 수강생 목록에서 제외하고,
                    대기 중인 KIT 배정도 함께 취소합니다. 이미 대여 중이라면 먼저
                    반납 처리해야 합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isDropping}
                  >
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                    disabled={isDropping}
                    onClick={(event) => {
                      event.preventDefault();
                      handleDropEnrollments();
                    }}
                  >
                    {isDropping ? "처리 중..." : "수강 취소"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={isInternalDialogOpen}
              onOpenChange={(open) => {
                if (isCreatingInternal) return;
                setIsInternalDialogOpen(open);
                if (!open) resetInternalForm();
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>내부 학생 추가</AlertDialogTitle>
                  <AlertDialogDescription>
                    학번으로 기존 사용자 계정을 찾아 수강생으로 등록합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label className="pb-2">학번</Label>
                    <Input
                      value={studentId}
                      onChange={(event) => setStudentId(event.target.value)}
                      placeholder="학번 입력"
                      disabled={isCreatingInternal}
                    />
                  </div>
                </div>

                <AlertDialogFooter className="pt-8">
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isCreatingInternal}
                  >
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    disabled={isCreatingInternal}
                    onClick={(event) => {
                      event.preventDefault();
                      handleCreateInternalEnrollment();
                    }}
                  >
                    {isCreatingInternal ? "추가 중..." : "추가"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={isGuestDialogOpen}
              onOpenChange={(open) => {
                if (isCreatingGuest) return;
                setIsGuestDialogOpen(open);
                if (!open) resetGuestForm();
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>게스트 학생 추가</AlertDialogTitle>
                  <AlertDialogDescription>
                    외부 또는 미등록 학생 정보를 입력해 게스트 수강생으로
                    등록합니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label className="pb-2">이름</Label>
                    <Input
                      value={guestUsername}
                      onChange={(event) => setGuestUsername(event.target.value)}
                      placeholder="이름 입력"
                      disabled={isCreatingGuest}
                    />
                  </div>

                  <div>
                    <Label className="pb-2">학번</Label>
                    <Input
                      value={guestStudentId}
                      onChange={(event) =>
                        setGuestStudentId(event.target.value)
                      }
                      placeholder="학번 입력"
                      disabled={isCreatingGuest}
                    />
                  </div>

                  <div>
                    <Label className="pb-2">학과</Label>
                    <Input
                      value={guestDepartmentName}
                      onChange={(event) =>
                        setGuestDepartmentName(event.target.value)
                      }
                      placeholder="학과 입력"
                      disabled={isCreatingGuest}
                    />
                  </div>

                  <div>
                    <Label className="pb-2">이메일</Label>
                    <Input
                      value={guestEmail}
                      onChange={(event) => setGuestEmail(event.target.value)}
                      placeholder="이메일 입력"
                      disabled={isCreatingGuest}
                    />
                  </div>
                </div>

                <AlertDialogFooter className="pt-8">
                  <AlertDialogCancel
                    className="cursor-pointer"
                    disabled={isCreatingGuest}
                  >
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    disabled={isCreatingGuest}
                    onClick={(event) => {
                      event.preventDefault();
                      handleCreateGuestEnrollment();
                    }}
                  >
                    {isCreatingGuest ? "추가 중..." : "추가"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-8">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableRow>
                <TableHead className="w-[60px] text-center">
                  <Checkbox
                    checked={
                      isAllSelected
                        ? true
                        : isSomeSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked === true)
                    }
                    aria-label="전체 수강생 선택"
                  />
                </TableHead>
                <TableHead className="text-white text-center">이름</TableHead>
                <TableHead className="text-white text-center">학번</TableHead>
                <TableHead className="text-white text-center">이메일</TableHead>
                <TableHead className="text-white text-center">학과</TableHead>
                <TableHead className="text-white text-center">역할</TableHead>
                <TableHead className="text-white text-center">등록일</TableHead>
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
                    수강생 목록을 불러오는 중입니다.
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-red-400"
                  >
                    수강생 목록 조회 중 오류가 발생했습니다.
                  </TableCell>
                </TableRow>
              ) : enrollments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-400"
                  >
                    조회된 수강생이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                enrollments.map((student) => {
                  const isSelected = selectedEnrollmentIds.includes(
                    student.enrollmentId,
                  );

                  return (
                    <TableRow key={student.enrollmentId}>
                      <TableCell className="text-center">
                        <Checkbox
                          className="mx-2"
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectEnrollment(
                              student.enrollmentId,
                              checked === true,
                            )
                          }
                          aria-label={`${student.username} 선택`}
                        />
                      </TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.departmentName}</TableCell>
                      <TableCell>
                        {ROLE_NAME_MAP[student.role?.trim().toUpperCase()] ??
                          student.role ??
                          "-"}
                      </TableCell>
                      <TableCell>{formatDate(student.createdAt)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Students;
