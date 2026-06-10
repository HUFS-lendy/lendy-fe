import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useGenerateKitAssignments,
  useKitAssignments,
} from "../../../api/ta.kitAssignment.api";
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

const KitOffering = () => {
  const { kitCourseOfferingId } = useParams();
  const courseOfferingId = Number(kitCourseOfferingId);

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useKitAssignments(courseOfferingId);
  const { mutate: generateKitAssignments, isPending: isGenerating } =
    useGenerateKitAssignments();

  const isInvalidCourseOfferingId =
    !Number.isFinite(courseOfferingId) || courseOfferingId <= 0;

  const formatDateTime = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("ko-KR");
  };

  const getStatusName = (status?: string) => {
    switch (status?.trim().toUpperCase()) {
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
    switch (status?.trim().toUpperCase()) {
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

  const handleGenerateKitAssignments = () => {
    if (isInvalidCourseOfferingId) {
      toast.warning("잘못된 강의 운영 ID입니다.");
      return;
    }

    generateKitAssignments(courseOfferingId, {
      onSuccess: () => {
        setIsGenerateDialogOpen(false);
      },
    });
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
                disabled={isInvalidCourseOfferingId}
                className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
              >
                자동 배정
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>KIT 자동 배정</AlertDialogTitle>
                <AlertDialogDescription>
                  수강생과 사용 가능한 KIT를 기준으로 자동 배정을
                  실행하시겠습니까?
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
        </div>

        <div className="mt-8">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableRow>
                <TableHead className="text-white text-center">이름</TableHead>
                <TableHead className="text-white text-center">학번</TableHead>
                <TableHead className="text-white text-center">
                  KIT 시리얼
                </TableHead>
                <TableHead className="text-white text-center">
                  아이템 ID
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
                    colSpan={6}
                    className="text-center py-8 text-red-400"
                  >
                    잘못된 강의 운영 ID입니다.
                  </TableCell>
                </TableRow>
              ) : isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-300"
                  >
                    KIT 배정 목록을 불러오는 중입니다.
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
                    colSpan={6}
                    className="text-center py-8 text-gray-400"
                  >
                    조회된 KIT 배정 정보가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((assignment) => (
                  <TableRow key={assignment.kitAssignmentId}>
                    <TableCell>{assignment.username}</TableCell>
                    <TableCell>{assignment.studentId}</TableCell>
                    <TableCell>{assignment.serial}</TableCell>
                    <TableCell>{assignment.itemId}</TableCell>
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
