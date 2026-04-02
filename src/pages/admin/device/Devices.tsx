import { useMemo, useState } from "react";
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
import { DeviceCategoryCombobox } from "../../../components/ui/DeviceCategory";
import { toast } from "sonner";
import DeviceNumberTag from "../../../hooks/useCodeNumberTags";
import {
  useCreateModel,
  useDeleteModel,
  useModels,
} from "../../../api/adminModel.api";
import { type ModelItem } from "../../../type/adminModel.type";

const Devices = () => {
  const navigate = useNavigate();

  const [deviceNumber, setDeviceNumber] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [selectedModelIds, setSelectedModelIds] = useState<number[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: devices = [], isLoading, isError } = useModels();
  const { mutateAsync: createModel, isPending: isCreating } = useCreateModel();
  const { mutateAsync: deleteModel, isPending: isDeleting } = useDeleteModel();

  const deviceModels = useMemo(() => {
    return (devices as ModelItem[]).filter(
      (model) => model.type === "EQUIPMENT",
    );
  }, [devices]);

  const resetCreateForm = () => {
    setCategoryName("");
    setDeviceName("");
    setTotalQty("");
    setDeviceNumber([]);
  };

  const toggleModelSelection = (modelId: number) => {
    setSelectedModelIds((prev) =>
      prev.includes(modelId)
        ? prev.filter((id) => id !== modelId)
        : [...prev, modelId],
    );
  };

  const handleCreateDevice = async () => {
    if (!categoryName.trim()) {
      toast.error("카테고리를 선택해주세요.");
      return;
    }

    if (!deviceName.trim()) {
      toast.error("기자재명을 입력해주세요.");
      return;
    }

    if (!totalQty || Number(totalQty) <= 0) {
      toast.error("기자재 대수를 올바르게 입력해주세요.");
      return;
    }

    try {
      await createModel({
        categoryName,
        type: "EQUIPMENT",
        name: deviceName.trim(),
        courseName: "",
        totalQty: Number(totalQty),
        serials: deviceNumber,
        qtyAndSerialsSizeMatching: true,
      });

      toast.success("기자재가 추가되었습니다.");
      resetCreateForm();
    } catch (error) {
      console.error(error);
      toast.error("기자재 추가에 실패했습니다.");
    }
  };

  const handleDeleteDevices = async () => {
    if (selectedModelIds.length === 0) {
      toast.error("삭제할 기자재를 선택해주세요.");
      return;
    }

    try {
      await Promise.all(
        selectedModelIds.map((modelId) => deleteModel(modelId)),
      );

      toast.success("선택한 기자재가 삭제되었습니다.");
      setSelectedModelIds([]);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("기자재 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="px-8 w-screen">
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
              <BreadcrumbPage className="text-white">기기 현황</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">기자재 현황</div>

        <div className="flex space-x-4 justify-end">
          {/* 기자재 추가 버튼 */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-neutral-400 hover:text-black border-neutral-400 text-sm">
                추가
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>기자재 추가</AlertDialogTitle>
                <AlertDialogDescription>
                  새 기자재를 추가하면 됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="pb-2">카테고리</Label>
                  <DeviceCategoryCombobox
                    value={categoryName}
                    onChange={setCategoryName}
                  />
                </div>

                <div>
                  <Label className="pb-2">기자재명</Label>
                  <Input
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="기자재명을 입력하세요"
                  />
                </div>

                <div>
                  <Label className="pb-2">기자재 대수</Label>
                  <Input
                    type="number"
                    min={1}
                    value={totalQty}
                    onChange={(e) => setTotalQty(e.target.value)}
                    placeholder="기자재 대수를 입력하세요"
                  />
                </div>

                <div>
                  <DeviceNumberTag
                    value={deviceNumber}
                    onChange={setDeviceNumber}
                  />
                </div>
              </div>

              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel disabled={isCreating}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    void handleCreateDevice();
                  }}
                  disabled={isCreating}
                >
                  {isCreating ? "추가 중..." : "추가"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* 기자재 삭제 버튼 */}
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <div
                className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300"
                onClick={(e) => {
                  if (selectedModelIds.length === 0) {
                    e.preventDefault();
                    toast.error("삭제할 기자재를 선택해주세요.");
                  }
                }}
              >
                삭제
              </div>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  선택한 기자재를 삭제하시겠습니까?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  기자재를 삭제하면 다시 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    void handleDeleteDevices();
                  }}
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
                <TableHead className="text-white text-center">분류</TableHead>
                <TableHead className="text-white text-center">
                  기자재명
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
                  <TableCell colSpan={7} className="text-center py-6">
                    불러오는 중...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-red-300"
                  >
                    기자재 목록을 불러오지 못했습니다.
                  </TableCell>
                </TableRow>
              ) : deviceModels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    등록된 기자재가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                deviceModels.map((device: ModelItem) => {
                  const checked = selectedModelIds.includes(device.modelId);

                  return (
                    <TableRow
                      key={device.modelId}
                      onClick={() =>
                        navigate(`/admin/devices/${device.modelId}`)
                      }
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() =>
                            toggleModelSelection(device.modelId)
                          }
                        />
                      </TableCell>
                      <TableCell>{device.categoryName}</TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.availableQty}</TableCell>
                      <TableCell>{device.reservedQty}</TableCell>
                      <TableCell>{device.rentedQty}</TableCell>
                      <TableCell className="font-bold">
                        {device.totalQty}
                      </TableCell>
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

export default Devices;
