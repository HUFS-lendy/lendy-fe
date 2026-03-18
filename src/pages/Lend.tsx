import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
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
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import { useModels } from "../api/model.api";
import type { ModelItem } from "../type/model.type";
import { useDoReserve } from "../api/reservationUser.api";

const Lend = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useModels();
  const { mutate: createReservation, isPending: isCreatingReservation } =
    useDoReserve();

  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const models = data?.data ?? [];

  const equipmentList = models.filter((item) => item.courseName === "");
  const kitList = models.filter((item) => item.courseName !== "");

  const selectedEquipment = equipmentList.find(
    (item) => item.modelId === selectedModelId,
  );
  const selectedKit = kitList.find((item) => item.modelId === selectedModelId);

  const handleSelectModel = (modelId: number, checked: boolean) => {
    setSelectedModelId(checked ? modelId : null);
  };

  const handleReserveEquipment = () => {
    if (!selectedModelId) {
      toast("대여할 기자재를 선택해주세요.");
      return;
    }

    createReservation(
      { modelId: selectedModelId },
      {
        onSuccess: () => {
          toast("대여 신청이 완료되었습니다.");
          navigate("/lending-state");
        },
        onError: () => {
          toast("대여 신청에 실패했습니다.");
        },
      },
    );
  };

  const handleReserveKit = () => {
    if (!selectedModelId) {
      toast("대여할 실습 키트를 선택해주세요.");
      return;
    }

    createReservation(
      { modelId: selectedModelId },
      {
        onSuccess: () => {
          toast("대여 신청이 완료되었습니다.");
          navigate("/lending-state");
        },
        onError: () => {
          toast("대여 신청에 실패했습니다.");
        },
      },
    );
  };

  return (
    <div className="bg-[#060a0c] w-screen min-h-screen px-8">
      <div className="pt-20">
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
              <BreadcrumbPage className="text-white">대여 신청</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">
          기자재 / 키트 대여 신청
        </div>

        <Tabs defaultValue="기자재">
          <TabsList className="bg-[#1e2427]">
            <TabsTrigger className="text-white bg-[#1e2427]" value="기자재">
              기자재
            </TabsTrigger>
            <TabsTrigger className="text-white bg-[#1e2427]" value="실습 키트">
              실습 키트
            </TabsTrigger>
          </TabsList>

          {/* 기자재 */}
          <TabsContent value="기자재">
            <div className="mt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      disabled={!selectedModelId || isCreatingReservation}
                      className="bg-[#060a0c] hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm text-white border border-neutral-400 rounded-md px-3 py-1"
                    >
                      대여
                    </button>
                  </div>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="pb-4">
                      기자재를 대여하시겠습니까?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="break-keep text-left">
                      {selectedEquipment && (
                        <div className="mb-4 text-black">
                          선택 항목: {selectedEquipment.name}
                        </div>
                      )}
                      반납 기한은 해당{" "}
                      <span className="font-bold">학기 종강일</span>까지이며,{" "}
                      <span className="text-red-500">
                        기한 내 미반납 시 일주일 간 이메일로 경고 메일이
                        발송되며 대여 서비스 내 패널티가 부여
                      </span>
                      될 수 있습니다.
                      <br />
                      <br />
                      ※ 대리 제출 및 수령 불가합니다.
                      <br />※ 노트북과 아이패드 중복 대여가 불가합니다.
                      <br />※ 타학과와 휴학생은 대여 불가합니다.
                      <br />※ 방학 중 대여 및 연장 불가 합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleReserveEquipment();
                      }}
                      disabled={isCreatingReservation}
                    >
                      {isCreatingReservation ? "처리 중..." : "대여"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Table className="text-white text-center border border-neutral-700">
                <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="text-white text-center">
                      분류
                    </TableHead>
                    <TableHead className="text-white text-center">
                      기자재명
                    </TableHead>
                    <TableHead className="text-white text-center">
                      잔여 대수
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="cursor-pointer">
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        로딩 중...
                      </TableCell>
                    </TableRow>
                  )}

                  {isError && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-red-400"
                      >
                        기자재 목록을 불러오지 못했습니다.
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    !isError &&
                    equipmentList.map((item: ModelItem) => (
                      <TableRow
                        key={item.modelId}
                        onClick={() =>
                          setSelectedModelId((prev) =>
                            prev === item.modelId ? null : item.modelId,
                          )
                        }
                      >
                        <TableCell>
                          <Checkbox
                            className="border-neutral-400"
                            checked={selectedModelId === item.modelId}
                            onCheckedChange={(checked) =>
                              handleSelectModel(item.modelId, checked === true)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.availableQty}</TableCell>
                      </TableRow>
                    ))}

                  {!isLoading && !isError && equipmentList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        기자재가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 실습 키트 */}
          <TabsContent value="실습 키트">
            <div className="mt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      disabled={!selectedModelId || isCreatingReservation}
                      className="bg-[#060a0c] hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm text-white border border-neutral-400 rounded-md px-3 py-1"
                    >
                      대여
                    </button>
                  </div>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="pb-4">
                      실습 키트를 대여하시겠습니까?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="break-keep text-left">
                      {selectedKit && (
                        <div className="mb-4 text-black">
                          선택 항목: {selectedKit.name}
                        </div>
                      )}
                      반납 기한은 해당{" "}
                      <span className="font-bold">학기 종강일</span>까지이며,{" "}
                      <span className="text-red-500">
                        기한 내 미반납 시 일주일 간 이메일로 경고 메일이
                        발송되며 대여 서비스 내 패널티가 부여
                      </span>
                      될 수 있습니다.
                      <br />
                      <br />
                      ※ 대리 제출 및 수령 불가합니다.
                      <br />※ 타학과와 휴학생은 대여 불가합니다.
                      <br />※ 방학 중 대여 및 연장 불가 합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleReserveKit();
                      }}
                      disabled={isCreatingReservation}
                    >
                      {isCreatingReservation ? "처리 중..." : "대여"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Table className="text-white text-center border border-neutral-700">
                <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead className="text-white text-center">
                      키트명
                    </TableHead>
                    <TableHead className="text-white text-center">
                      사용 수업명
                    </TableHead>
                    <TableHead className="text-white text-center">
                      잔여 대수
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="cursor-pointer">
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        로딩 중...
                      </TableCell>
                    </TableRow>
                  )}

                  {isError && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-red-400"
                      >
                        실습 키트 목록을 불러오지 못했습니다.
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading &&
                    !isError &&
                    kitList.map((item: ModelItem) => (
                      <TableRow
                        key={item.modelId}
                        onClick={() =>
                          setSelectedModelId((prev) =>
                            prev === item.modelId ? null : item.modelId,
                          )
                        }
                      >
                        <TableCell>
                          <Checkbox
                            className="border-neutral-400"
                            checked={selectedModelId === item.modelId}
                            onCheckedChange={(checked) =>
                              handleSelectModel(item.modelId, checked === true)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.courseName}</TableCell>
                        <TableCell>{item.availableQty}</TableCell>
                      </TableRow>
                    ))}

                  {!isLoading && !isError && kitList.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        실습 키트가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Lend;
