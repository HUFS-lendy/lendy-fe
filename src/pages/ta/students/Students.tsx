import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCourseEnrollments,
  useCreateGuestEnrollment,
  useCreateInternalEnrollment,
} from "../../../api/ta.kitEnrollment.api";
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

const Students = () => {
  const { kitCourseOfferingId } = useParams();
  const courseOfferingId = Number(kitCourseOfferingId);

  const [isSelectTypeDialogOpen, setIsSelectTypeDialogOpen] = useState(false);
  const [isInternalDialogOpen, setIsInternalDialogOpen] = useState(false);
  const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [guestUsername, setGuestUsername] = useState("");
  const [guestStudentId, setGuestStudentId] = useState("");
  const [guestDepartmentName, setGuestDepartmentName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const {
    data: enrollments = [],
    isLoading,
    isError,
  } = useCourseEnrollments(courseOfferingId);
  const { mutate: createInternalEnrollment, isPending: isCreatingInternal } =
    useCreateInternalEnrollment();
  const { mutate: createGuestEnrollment, isPending: isCreatingGuest } =
    useCreateGuestEnrollment();

  const isInvalidCourseOfferingId =
    !Number.isFinite(courseOfferingId) || courseOfferingId <= 0;

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
                href="/ta/kit-course-offering"
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

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>수강생 추가</AlertDialogTitle>
                  <AlertDialogDescription>
                    추가할 학생 종류를 선택해주세요.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button
                    type="button"
                    className="border rounded-md px-4 py-6 text-left hover:bg-neutral-100 hover:text-black"
                    onClick={handleOpenInternalDialog}
                  >
                    <div className="text-lg font-semibold">내부 학생</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      학번으로 기존 사용자 계정을 찾아 등록합니다.
                    </div>
                  </button>

                  <button
                    type="button"
                    className="border rounded-md px-4 py-6 text-left hover:bg-neutral-100 hover:text-black"
                    onClick={handleOpenGuestDialog}
                  >
                    <div className="text-lg font-semibold">게스트 학생</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      외부 또는 미등록 학생 정보를 직접 입력해 등록합니다.
                    </div>
                  </button>
                </div>

                <AlertDialogFooter className="pt-8">
                  <AlertDialogCancel className="cursor-pointer">
                    취소
                  </AlertDialogCancel>
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
                <TableHead className="text-white text-center">이름</TableHead>
                <TableHead className="text-white text-center">학번</TableHead>
                <TableHead className="text-white text-center">이메일</TableHead>
                <TableHead className="text-white text-center">학과</TableHead>
                <TableHead className="text-white text-center">역할</TableHead>
                <TableHead className="text-white text-center">상태</TableHead>
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
                enrollments.map((student) => (
                  <TableRow key={student.enrollmentId}>
                    <TableCell>{student.username}</TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.departmentName}</TableCell>
                    <TableCell>{student.role}</TableCell>
                    <TableCell>{student.status}</TableCell>
                    <TableCell>{formatDate(student.createdAt)}</TableCell>
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

export default Students;
