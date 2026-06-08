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
import { useMyCourse } from "../../../api/ta.kitCourseOffering.api";

const KitCourseOffering = () => {
  const navigate = useNavigate();
  const { data: courses = [], isLoading, isError } = useMyCourse();

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR");
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
              <BreadcrumbPage className="text-white">조교</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                강의 운영 목록
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mt-10">
        <h1 className="text-3xl font-bold">내 KIT 강의 운영 목록</h1>
        <p className="mt-2 text-sm text-gray-400">
          현재 로그인한 조교가 담당하는 KIT 강의 목록입니다.
        </p>

        <div className="mt-8">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableRow>
                <TableHead className="text-white text-center">강의명</TableHead>
                <TableHead className="text-white text-center">학기</TableHead>
                <TableHead className="text-white text-center">
                  KIT 모델명
                </TableHead>
                <TableHead className="text-white text-center">
                  담당 조교
                </TableHead>
                <TableHead className="text-white text-center">
                  운영 상태
                </TableHead>
                <TableHead className="text-white text-center">생성일</TableHead>
                <TableHead className="text-white text-center">수정일</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-300"
                  >
                    강의 목록을 불러오는 중입니다.
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-red-400"
                  >
                    강의 목록 조회 중 오류가 발생했습니다.
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-400"
                  >
                    조회된 KIT 강의 운영 목록이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow
                    key={course.kitCourseOfferingId}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/ta/kit-course-offering/${course.kitCourseOfferingId}`,
                      )
                    }
                  >
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>{course.academicTermCode}</TableCell>
                    <TableCell>{course.modelName}</TableCell>
                    <TableCell>{course.assistantUsername}</TableCell>
                    <TableCell>
                      <span
                        className={
                          course.active
                            ? "text-green-300 font-semibold"
                            : "text-gray-400 font-semibold"
                        }
                      >
                        {course.active ? "운영중" : "비활성"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(course.createdAt)}</TableCell>
                    <TableCell>{formatDate(course.updatedAt)}</TableCell>
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

export default KitCourseOffering;
