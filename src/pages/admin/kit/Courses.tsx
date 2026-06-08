import { useState } from "react";
import { toast } from "sonner";
import { KitCombobox } from "../../../components/ui/KitCombobox";
import { FullSemesterCombobox } from "../../../components/ui/FullSemesterCombobox";
import { CourseCombobox } from "../../../components/ui/CourseCombobox";
import { TACombobox } from "../../../components/ui/TACombobox";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
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
  useCreateKitCourseOffering,
  useDeleteKitCourseOffering,
  useKitCourseOfferings,
  useUpdateKitCourseOffering,
} from "../../../api/admin.kitCourseOffering.api";

const Courses = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedAcademicTermId, setSelectedAcademicTermId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedKitModelId, setSelectedKitModelId] = useState("");
  const [selectedAssistantUserId, setSelectedAssistantUserId] = useState("");

  const [updateKitModelId, setUpdateKitModelId] = useState("");
  const [updateAssistantUserId, setUpdateAssistantUserId] = useState("");
  const [updateActive, setUpdateActive] = useState(true);

  const [selectedCourseOfferingId, setSelectedCourseOfferingId] = useState<
    number | null
  >(null);

  const {
    data: courseOfferings = [],
    isLoading,
    isError,
  } = useKitCourseOfferings();
  const { mutate: createKitCourseOffering, isPending: isCreating } =
    useCreateKitCourseOffering();
  const { mutate: updateKitCourseOffering, isPending: isUpdating } =
    useUpdateKitCourseOffering();
  const { mutate: deleteKitCourseOffering, isPending: isDeleting } =
    useDeleteKitCourseOffering();

  const selectedCourseOffering = courseOfferings.find(
    (course) => course.kitCourseOfferingId === selectedCourseOfferingId,
  );

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR");
  };

  const resetCreateForm = () => {
    setSelectedAcademicTermId("");
    setSelectedCourseId("");
    setSelectedKitModelId("");
    setSelectedAssistantUserId("");
  };

  const resetUpdateForm = () => {
    setUpdateKitModelId("");
    setUpdateAssistantUserId("");
    setUpdateActive(true);
  };

  const setUpdateFormBySelectedCourseOffering = () => {
    if (!selectedCourseOffering) return;
    setUpdateKitModelId(String(selectedCourseOffering.modelId));
    setUpdateAssistantUserId(String(selectedCourseOffering.assistantUserId));
    setUpdateActive(selectedCourseOffering.active);
  };

  const handleCreateKitCourseOffering = () => {
    if (!selectedAcademicTermId) {
      toast.warning("학기를 선택해주세요.");
      return;
    }

    if (!selectedCourseId) {
      toast.warning("강의를 선택해주세요.");
      return;
    }

    if (!selectedKitModelId) {
      toast.warning("키트를 선택해주세요.");
      return;
    }

    if (!selectedAssistantUserId) {
      toast.warning("조교를 선택해주세요.");
      return;
    }

    createKitCourseOffering(
      {
        academicTermId: Number(selectedAcademicTermId),
        courseId: Number(selectedCourseId),
        modelId: Number(selectedKitModelId),
        assistantUserId: Number(selectedAssistantUserId),
      },
      {
        onSuccess: () => {
          resetCreateForm();
          setIsCreateDialogOpen(false);
        },
      },
    );
  };

  const handleUpdateKitCourseOffering = () => {
    if (selectedCourseOfferingId === null) {
      toast.warning("수정할 강의 운영을 선택해주세요.");
      return;
    }

    if (!updateKitModelId) {
      toast.warning("키트를 선택해주세요.");
      return;
    }

    if (!updateAssistantUserId) {
      toast.warning("조교를 선택해주세요.");
      return;
    }

    updateKitCourseOffering(
      {
        id: selectedCourseOfferingId,
        request: {
          modelId: Number(updateKitModelId),
          assistantUserId: Number(updateAssistantUserId),
          active: updateActive,
        },
      },
      {
        onSuccess: () => {
          resetUpdateForm();
          setIsUpdateDialogOpen(false);
        },
      },
    );
  };

  const handleSelectCourseOffering = (id: number, checked: boolean) => {
    setSelectedCourseOfferingId(checked ? id : null);
  };

  const handleDeleteKitCourseOffering = () => {
    if (selectedCourseOfferingId === null) {
      toast.warning("삭제할 강의 운영을 선택해주세요.");
      return;
    }

    deleteKitCourseOffering(selectedCourseOfferingId, {
      onSuccess: () => {
        setSelectedCourseOfferingId(null);
        setIsDeleteDialogOpen(false);
      },
    });
  };

  return (
    <div className="bg-[#060a0c] w-screen min-h-screen px-8 text-white">
      <div className="pt-14">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/"
              >
                홈
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">강의 현황</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">강의 현황</div>

        <div className="flex space-x-4 justify-end">
          <AlertDialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              if (isCreating) return;
              setIsCreateDialogOpen(open);
              if (!open) resetCreateForm();
            }}
          >
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm"
              >
                추가
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>운영 강의 추가</AlertDialogTitle>
                <AlertDialogDescription>
                  새 강의를 추가하면 됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="pb-2">해당 학기</Label>
                  <FullSemesterCombobox
                    value={selectedAcademicTermId}
                    onChange={setSelectedAcademicTermId}
                  />
                </div>

                <div>
                  <Label className="pb-2">강의</Label>
                  <CourseCombobox
                    value={selectedCourseId}
                    onChange={setSelectedCourseId}
                  />
                </div>

                <div>
                  <Label className="pb-2">키트</Label>
                  <KitCombobox
                    value={selectedKitModelId}
                    onChange={setSelectedKitModelId}
                  />
                </div>

                <div>
                  <Label className="pb-2">조교</Label>
                  <TACombobox
                    value={selectedAssistantUserId}
                    onChange={setSelectedAssistantUserId}
                  />
                </div>
              </div>

              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel
                  className="cursor-pointer"
                  disabled={isCreating}
                >
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  disabled={isCreating}
                  onClick={(event) => {
                    event.preventDefault();
                    handleCreateKitCourseOffering();
                  }}
                >
                  {isCreating ? "추가 중..." : "추가"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={isUpdateDialogOpen}
            onOpenChange={(open) => {
              if (isUpdating) return;
              if (open && !selectedCourseOffering) {
                toast.warning("수정할 강의 운영을 선택해주세요.");
                return;
              }
              setIsUpdateDialogOpen(open);
              if (open) setUpdateFormBySelectedCourseOffering();
              if (!open) resetUpdateForm();
            }}
          >
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={selectedCourseOfferingId === null}
                className="border cursor-pointer px-3 py-1 rounded-sm border-neutral-400 text-white hover:bg-neutral-400 hover:text-black disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
              >
                수정
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>운영 강의 수정</AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedCourseOffering
                    ? `${selectedCourseOffering.courseName} 강의 운영 정보를 수정합니다.`
                    : "선택한 강의 운영 정보를 수정합니다."}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="pb-2">강의</Label>
                  <div className="border rounded-md px-3 py-2 text-sm text-muted-foreground">
                    {selectedCourseOffering
                      ? `${selectedCourseOffering.courseName} (${selectedCourseOffering.academicTermCode})`
                      : "-"}
                  </div>
                </div>

                <div>
                  <Label className="pb-2">키트</Label>
                  <KitCombobox
                    value={updateKitModelId}
                    onChange={setUpdateKitModelId}
                  />
                </div>

                <div>
                  <Label className="pb-2">조교</Label>
                  <TACombobox
                    value={updateAssistantUserId}
                    onChange={setUpdateAssistantUserId}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="update-active"
                    checked={updateActive}
                    onCheckedChange={(checked) =>
                      setUpdateActive(checked === true)
                    }
                  />
                  <Label htmlFor="update-active" className="cursor-pointer">
                    운영중
                  </Label>
                </div>
              </div>

              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel
                  className="cursor-pointer"
                  disabled={isUpdating}
                >
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  disabled={isUpdating}
                  onClick={(event) => {
                    event.preventDefault();
                    handleUpdateKitCourseOffering();
                  }}
                >
                  {isUpdating ? "수정 중..." : "수정"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              if (isDeleting) return;
              setIsDeleteDialogOpen(open);
            }}
          >
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={selectedCourseOfferingId === null}
                className="border cursor-pointer px-3 py-1 rounded-sm border-red-500 text-red-400 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-neutral-600 disabled:text-neutral-600 disabled:hover:bg-transparent"
              >
                삭제
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>운영 강의 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedCourseOffering
                    ? `${selectedCourseOffering.courseName} 강의 운영 정보를 삭제하시겠습니까?`
                    : "선택한 강의 운영 정보를 삭제하시겠습니까?"}
                  <br />
                  삭제한 정보는 복구할 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel
                  className="cursor-pointer"
                  disabled={isDeleting}
                >
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                  disabled={isDeleting}
                  onClick={(event) => {
                    event.preventDefault();
                    handleDeleteKitCourseOffering();
                  }}
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
                <TableHead className="w-[60px] text-center"></TableHead>
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
                  <TableCell colSpan={8} className="text-center py-8">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-red-300"
                  >
                    강의 운영 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              ) : courseOfferings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-gray-400"
                  >
                    등록된 강의 운영 정보가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                courseOfferings.map((course) => {
                  const isSelected =
                    selectedCourseOfferingId === course.kitCourseOfferingId;

                  return (
                    <TableRow key={course.kitCourseOfferingId}>
                      <TableCell className="text-center">
                        <Checkbox
                          className="mx-2"
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectCourseOffering(
                              course.kitCourseOfferingId,
                              checked === true,
                            )
                          }
                          aria-label={`${course.courseName} 선택`}
                        />
                      </TableCell>
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

export default Courses;
