import { useMyCourse } from "../../../api/ta.kitCourseOffering.api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";

const KitCourseOffering = () => {
  const { data: courses, isLoading, isError } = useMyCourse();

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
        <h1 className="text-2xl font-bold">내 KIT 강의 운영 목록</h1>
        <p className="mt-2 text-sm text-gray-400">
          현재 로그인한 조교가 담당하는 KIT 강의 목록입니다.
        </p>

        {isLoading && (
          <div className="mt-8 text-gray-300">
            강의 목록을 불러오는 중입니다.
          </div>
        )}

        {isError && (
          <div className="mt-8 text-red-400">
            강의 목록 조회 중 오류가 발생했습니다.
          </div>
        )}

        {!isLoading && !isError && courses?.length === 0 && (
          <div className="mt-8 rounded-xl border border-gray-700 bg-[#0f1519] p-6 text-gray-300">
            조회된 KIT 강의 운영 목록이 없습니다.
          </div>
        )}

        {!isLoading && !isError && courses && courses.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div
                key={course.kitCourseOfferingId}
                className="rounded-xl border border-gray-700 bg-[#0f1519] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {course.courseName}
                    </h2>
                    <p className="mt-1 text-sm text-gray-400">
                      {course.academicTermCode}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${course.active ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}`}
                  >
                    {course.active ? "운영중" : "비활성"}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">모델명</div>
                    <div className="mt-1 text-gray-200">{course.modelName}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">조교</div>
                    <div className="mt-1 text-gray-200">
                      {course.assistantUsername}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">강의 ID</div>
                    <div className="mt-1 text-gray-200">{course.courseId}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">KIT 운영 ID</div>
                    <div className="mt-1 text-gray-200">
                      {course.kitCourseOfferingId}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitCourseOffering;
