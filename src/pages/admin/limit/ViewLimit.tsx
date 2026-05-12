import { useState } from "react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "../../../components/ui/calendar";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { SemesterCombobox } from "../../../components/ui/SemesterCombobox";
import { toast } from "sonner";
import {
  useAcademicTerms,
  useCreateAcademicTerm,
  useDeleteAcademicTerm,
  useUpdateAcademicTerm,
} from "../../../api/academicTerm.api";

const ViewLimit = () => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [year, setYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [active, setActive] = useState("false");
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  const { mutate: createAcademicTerm, isPending: isCreating } =
    useCreateAcademicTerm();
  const { data: academicTerms = [], isLoading, isError } = useAcademicTerms();
  const { mutate: deleteAcademicTerm, isPending: isDeleting } =
    useDeleteAcademicTerm();
  const { mutate: updateAcademicTerm, isPending: isUpdating } =
    useUpdateAcademicTerm();

  const formatDateToKSTString = (value: Date) => {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCreateAcademicTerm = () => {
    if (!year.trim()) {
      toast("년도를 입력해주세요.");
      return;
    }

    if (!selectedTerm) {
      toast("학기를 선택해주세요.");
      return;
    }

    if (!startDate) {
      toast("개강일을 선택해주세요.");
      return;
    }

    if (!endDate) {
      toast("종강일을 선택해주세요.");
      return;
    }

    if (startDate > endDate) {
      toast("개강일은 종강일보다 늦을 수 없습니다.");
      return;
    }

    createAcademicTerm(
      {
        year: Number(year),
        term: selectedTerm,
        startDate: formatDateToKSTString(startDate),
        endDate: formatDateToKSTString(endDate),
        active: active === "true",
      },
      {
        onSuccess: (res) => {
          toast(res.message ?? "학기가 추가되었습니다.");
          setYear("");
          setSelectedTerm("");
          setStartDate(undefined);
          setEndDate(undefined);
          setActive("false");
        },
        onError: (error) => {
          toast(
            error instanceof Error
              ? error.message
              : "학기 추가에 실패했습니다.",
          );
        },
      },
    );
  };

  const selectedAcademicTerm =
    academicTerms.find((term) => term.id === selectedTermId) ?? null;

  const handleDeleteAcademicTerm = () => {
    if (!selectedTermId) {
      toast("삭제할 학기를 선택해주세요.");
      return;
    }

    deleteAcademicTerm(selectedTermId, {
      onSuccess: (res) => {
        toast(res.message ?? "해당 종강일이 삭제되었습니다.");
        setSelectedTermId(null);
      },
      onError: (error) => {
        toast(
          error instanceof Error
            ? error.message
            : "종강일 삭제에 실패했습니다.",
        );
      },
    });
  };

  const handleOpenUpdateDialog = () => {
    if (!selectedAcademicTerm) {
      toast("수정할 학기를 선택해주세요.");
      return;
    }

    setYear(String(selectedAcademicTerm.year));
    setSelectedTerm(selectedAcademicTerm.term);
    setStartDate(
      selectedAcademicTerm.startDate
        ? new Date(selectedAcademicTerm.startDate)
        : undefined,
    );
    setEndDate(
      selectedAcademicTerm.endDate
        ? new Date(selectedAcademicTerm.endDate)
        : undefined,
    );
    setActive(selectedAcademicTerm.active ? "true" : "false");
  };

  const handleUpdateAcademicTerm = () => {
    if (!selectedAcademicTerm) {
      toast("수정할 학기를 선택해주세요.");
      return;
    }

    if (!year.trim()) {
      toast("년도를 입력해주세요.");
      return;
    }

    if (!selectedTerm) {
      toast("학기를 선택해주세요.");
      return;
    }

    if (!startDate) {
      toast("개강일을 선택해주세요.");
      return;
    }

    if (!endDate) {
      toast("종강일을 선택해주세요.");
      return;
    }

    if (startDate > endDate) {
      toast("개강일은 종강일보다 늦을 수 없습니다.");
      return;
    }

    updateAcademicTerm(
      {
        termId: selectedAcademicTerm.id,
        year: Number(year),
        term: selectedTerm,
        startDate: formatDateToKSTString(startDate),
        endDate: formatDateToKSTString(endDate),
        active: active === "true",
      },
      {
        onSuccess: (res) => {
          toast(res.message ?? "학기가 수정되었습니다.");
          setYear("");
          setSelectedTerm("");
          setStartDate(undefined);
          setEndDate(undefined);
          setActive("false");
          setSelectedTermId(null);
        },
        onError: (error) => {
          toast(
            error instanceof Error
              ? error.message
              : "학기 수정에 실패했습니다.",
          );
        },
      },
    );
  };

  return (
    <div className="px-8 w-screen">
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
                종강일 설정 현황
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">
          종강일 설정 현황
        </div>

        <div className="flex space-x-4 justify-end">
          {/* 종강일 추가 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                추가
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>종강일 추가</AlertDialogTitle>
                <AlertDialogDescription>
                  새 종강일을 추가하면 됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="pb-2">년도</Label>
                  <Input
                    className="w-1/3"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="pb-2">학기</Label>
                  <SemesterCombobox
                    value={selectedTerm}
                    onChange={setSelectedTerm}
                  />
                </div>

                <div>
                  <Label className="pb-2">개강일</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <div className="inline-block w-fit border text-sm rounded-sm px-3 py-1 cursor-pointer">
                        {startDate
                          ? startDate.toLocaleDateString()
                          : "개강일 선택"}
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto rounded-2xl overflow-hidden p-0 bg-white text-black border border-black/10"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={startDate}
                        captionLayout="dropdown"
                        onSelect={(d) => {
                          setStartDate(d);
                          setStartDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="pb-2">종강일</Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <div className="inline-block w-fit border text-sm rounded-sm px-3 py-1 cursor-pointer">
                        {endDate ? endDate.toLocaleDateString() : "종강일 선택"}
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto rounded-2xl overflow-hidden p-0 bg-white text-black border border-black/10"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={endDate}
                        captionLayout="dropdown"
                        onSelect={(d) => {
                          setEndDate(d);
                          setEndDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="pb-2">현재 학기 여부</Label>
                  <RadioGroup value={active} onValueChange={setActive}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="active-yes" />
                      <Label htmlFor="active-yes">예</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="active-no" />
                      <Label htmlFor="active-no">아니오</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCreateAcademicTerm}
                  disabled={isCreating}
                >
                  {isCreating ? "추가 중..." : "추가"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* 종강일 수정 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                onClick={handleOpenUpdateDialog}
                className={`border px-3 py-1 rounded-sm text-sm ${
                  selectedTermId
                    ? "cursor-pointer hover:bg-neutral-400 hover:text-black border-neutral-400"
                    : "cursor-not-allowed border-neutral-700 text-neutral-600"
                }`}
              >
                수정
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>종강일 수정</AlertDialogTitle>
                <AlertDialogDescription>
                  선택한 종강일 정보를 수정합니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="pb-2">년도</Label>
                  <Input
                    className="w-1/3"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="pb-2">학기</Label>
                  <SemesterCombobox
                    value={selectedTerm}
                    onChange={setSelectedTerm}
                  />
                </div>

                <div>
                  <Label className="pb-2">개강일</Label>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <div className="inline-block w-fit border text-sm rounded-sm px-3 py-1 cursor-pointer">
                        {startDate
                          ? startDate.toLocaleDateString()
                          : "개강일 선택"}
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto rounded-2xl overflow-hidden p-0 bg-white text-black border border-black/10"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={startDate}
                        captionLayout="dropdown"
                        onSelect={(d) => {
                          setStartDate(d);
                          setStartDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="pb-2">종강일</Label>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <div className="inline-block w-fit border text-sm rounded-sm px-3 py-1 cursor-pointer">
                        {endDate ? endDate.toLocaleDateString() : "종강일 선택"}
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto rounded-2xl overflow-hidden p-0 bg-white text-black border border-black/10"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={endDate}
                        captionLayout="dropdown"
                        onSelect={(d) => {
                          setEndDate(d);
                          setEndDateOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="pb-2">현재 학기 여부</Label>
                  <RadioGroup value={active} onValueChange={setActive}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="active-yes" />
                      <Label htmlFor="active-yes">예</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="active-no" />
                      <Label htmlFor="active-no">아니오</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleUpdateAcademicTerm}
                  disabled={!selectedAcademicTerm || isUpdating}
                >
                  {isUpdating ? "수정 중..." : "수정"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* 종강일 삭제 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                className={`border px-3 py-1 rounded-sm text-sm ${
                  selectedTermId
                    ? "cursor-pointer hover:bg-red-400 hover:text-black border-red-400 text-red-300"
                    : "cursor-not-allowed border-neutral-700 text-neutral-600"
                }`}
              >
                삭제
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedAcademicTerm
                    ? `${selectedAcademicTerm.code} 종강일을 삭제하시겠습니까?`
                    : "종강일을 삭제하시겠습니까?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedAcademicTerm?.code}의 기간은{" "}
                  <strong>
                    '{selectedAcademicTerm?.startDate} ~{" "}
                    {selectedAcademicTerm?.endDate}'
                  </strong>
                  입니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAcademicTerm}
                  disabled={!selectedAcademicTerm || isDeleting}
                  className="bg-red-600 hover:bg-red-500 font-bold"
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* 종강일 테이블 */}
        <div className="mt-4">
          <Table className="text-white text-center border border-neutral-700">
            <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
              <TableRow>
                <TableHead></TableHead>
                <TableHead className="text-white text-center">년도</TableHead>
                <TableHead className="text-white text-center">학기</TableHead>
                <TableHead className="text-white text-center">개강일</TableHead>
                <TableHead className="text-white text-center">종강일</TableHead>
                <TableHead className="text-white text-center">
                  현재 학기
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="cursor-pointer">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-red-300"
                  >
                    학기 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              ) : academicTerms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    등록된 종강일이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                academicTerms.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedTermId === term.id}
                        onCheckedChange={(checked) => {
                          setSelectedTermId(checked ? term.id : null);
                        }}
                      />
                    </TableCell>
                    <TableCell>{term.year}</TableCell>
                    <TableCell>{term.code}</TableCell>
                    <TableCell>{term.startDate}</TableCell>
                    <TableCell>{term.endDate}</TableCell>
                    <TableCell>{term.active ? "O" : ""}</TableCell>
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

export default ViewLimit;
