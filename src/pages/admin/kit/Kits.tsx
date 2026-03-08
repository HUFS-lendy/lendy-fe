import { useMemo, useState } from "react";
import axios from "axios";
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
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { toast } from "sonner";
import KitNumberTags from "../../../hooks/useCodeNumberTags";
import {
  useCreateModel,
  useDeleteModel,
  useModels,
  type ModelItem,
} from "../../../api/adminModel.api";

const Kits = () => {
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [kitName, setKitName] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [kitNumbers, setKitNumbers] = useState<string[]>([]);
  const [selectedKitIds, setSelectedKitIds] = useState<number[]>([]);

  const { mutate: createModel, isPending } = useCreateModel();
  const { mutateAsync: deleteModel, isPending: isDeleting } = useDeleteModel();
  const { data: models = [], isLoading, isError } = useModels();

  const kitModels = useMemo(() => {
    return (models as ModelItem[]).filter((model) => model.type === "KIT");
  }, [models]);

  const toggleKitSelection = (modelId: number) => {
    setSelectedKitIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId],
    );
  };

  // 키트 추가
  const handleCreateKit = () => {
    if (!courseName.trim()) {
      toast.error("강의명을 입력해주세요.");
      return;
    }

    if (!kitName.trim()) {
      toast.error("실습 키트명을 입력해주세요.");
      return;
    }

    if (!Number(totalQty) || Number(totalQty) <= 0) {
      toast.error("키트 수량을 올바르게 입력해주세요.");
      return;
    }

    if (kitNumbers.length === 0) {
      toast.error("키트 번호를 1개 이상 입력해주세요.");
      return;
    }

    createModel(
      {
        categoryName: kitName.trim(),
        type: "KIT",
        name: kitName.trim(),
        courseName: courseName.trim(),
        totalQty: Number(totalQty),
        serials: kitNumbers,
        qtyAndSerialsSizeMatching: true,
      },
      {
        onSuccess: () => {
          toast.success("실습키트가 추가되었습니다.");
          setCourseName("");
          setKitName("");
          setTotalQty("");
          setKitNumbers([]);
          navigate("/admin/kits");
        },
        onError: (error) => {
          console.error(error);

          if (axios.isAxiosError(error)) {
            console.log("status:", error.response?.status);
            console.log("data:", error.response?.data);
            console.log("headers:", error.response?.headers);
          }

          toast.error("실습키트 추가에 실패했습니다.");
        },
      },
    );
  };

  // 키트 삭제
  const handleDeleteSelectedKits = async () => {
    if (selectedKitIds.length === 0) {
      toast.error("삭제할 실습키트를 선택해주세요.");
      return;
    }

    try {
      await Promise.all(selectedKitIds.map((modelId) => deleteModel(modelId)));
      toast.success("선택한 실습키트가 삭제되었습니다.");
      setSelectedKitIds([]);
    } catch (error) {
      console.error(error);
      toast.error("실습키트 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white">
      <div className="pt-10">
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
              <BreadcrumbPage className="text-white">
                실습키트 현황
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">실습키트 현황</div>

        <div className="flex space-x-4 justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                추가
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>실습 키트 추가</AlertDialogTitle>
                <AlertDialogDescription>
                  새 키트를 추가하면 됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <div className="flex space-x-8">
                  <div className="w-full max-w-[280px]">
                    <Label className="pb-2">강의명</Label>
                    <Input
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="pb-2">실습 키트명</Label>
                  <Input
                    value={kitName}
                    onChange={(e) => setKitName(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="pb-2">키트 수량</Label>
                  <Input
                    type="number"
                    value={totalQty}
                    onChange={(e) => setTotalQty(e.target.value)}
                  />
                </div>

                <KitNumberTags value={kitNumbers} onChange={setKitNumbers} />
              </div>

              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleCreateKit();
                  }}
                  disabled={isPending}
                >
                  {isPending ? "추가 중..." : "추가"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300">
                삭제
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  선택한 키트를 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  키트를 삭제하면 다시 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSelectedKits}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-500 font-bold"
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
                <TableHead></TableHead>
                <TableHead className="text-white text-center">키트명</TableHead>
                <TableHead className="text-white text-center">
                  사용 수업명
                </TableHead>
                <TableHead className="text-white text-center">
                  잔여 대수
                </TableHead>
                <TableHead className="text-white text-center">
                  예약 중
                </TableHead>
                <TableHead className="text-white text-center">
                  대여 완료
                </TableHead>
                <TableHead className="text-white text-center">총합</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="cursor-pointer">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    로딩 중...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-red-300"
                  >
                    실습키트 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              ) : kitModels.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-400"
                  >
                    등록된 실습키트가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                kitModels.map((kit) => (
                  <TableRow
                    key={kit.modelId}
                    onClick={() => navigate(`/admin/kits/${kit.modelId}`)}
                  >
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Checkbox
                        checked={selectedKitIds.includes(kit.modelId)}
                        onCheckedChange={() => toggleKitSelection(kit.modelId)}
                      />
                    </TableCell>
                    <TableCell>{kit.name}</TableCell>
                    <TableCell>{kit.courseName}</TableCell>
                    <TableCell>{kit.availableQty}</TableCell>
                    <TableCell>{kit.reservedQty}</TableCell>
                    <TableCell>{kit.rentedQty}</TableCell>
                    <TableCell className="font-bold">{kit.totalQty}</TableCell>
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

export default Kits;
