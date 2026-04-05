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
import { Label } from "../components/ui/label";
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
  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [isPledgeAgreed, setIsPledgeAgreed] = useState(false);
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
    setIsPledgeAgreed(false);
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

    // todo: 에러메시지 동적처리
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
                          선택 항목: <strong>{selectedEquipment.name}</strong>
                        </div>
                      )}

                      <div className="text-black">
                        반납 기한은 해당{" "}
                        <span className="font-bold">학기 종강일</span>까지이며,
                        기한 내 미반납 시 일주일 간 이메일로 경고 메일이
                        발송되며 대여 서비스 내 패널티가 부여 될 수 있습니다.
                      </div>

                      <div className="mt-5 rounded-md border p-4">
                        <button
                          type="button"
                          className="rounded-md cursor-pointer border px-4 py-2 text-sm text-black hover:bg-neutral-100"
                          onClick={() => setPledgeDialogOpen(true)}
                        >
                          기자재 대여 서약 조항 보기
                        </button>

                        <div className="mt-3 text-sm">
                          {isPledgeAgreed ? (
                            <span className="text-green-600 font-medium">
                              서약 조항에 동의했습니다.
                            </span>
                          ) : (
                            <span className="text-red-500 font-medium">
                              서약 조항 동의가 필요합니다.
                            </span>
                          )}
                        </div>
                      </div>
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
                      disabled={!isPledgeAgreed || isCreatingReservation}
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
                        onClick={() => {
                          setSelectedModelId((prev) =>
                            prev === item.modelId ? null : item.modelId,
                          );
                          setIsPledgeAgreed(false);
                        }}
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
              <AlertDialog
                open={pledgeDialogOpen}
                onOpenChange={setPledgeDialogOpen}
              >
                <AlertDialogContent className="max-w-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>기자재 대여 서약 조항</AlertDialogTitle>
                    <AlertDialogDescription className="text-left break-keep">
                      아래 조항을 반드시 확인해주세요.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="max-h-[420px] overflow-y-auto rounded-md border p-4 text-sm leading-7 text-black">
                    <p>
                      1. 대여한 기자재는 본인만 사용하며 타인에게 양도하거나
                      대여하지 않습니다.
                    </p>
                    <p>
                      2. 대여 기자재의 분실, 파손, 침수, 임의 개조 시 관련
                      규정에 따라 책임을 부담합니다.
                    </p>
                    <p>
                      3. 반납 기한을 준수하며, 미반납 시 경고 메일 발송 및
                      패널티 부여에 동의합니다.
                    </p>
                    <p>
                      4. 방학 중 대여 및 연장이 제한될 수 있음을 확인합니다.
                    </p>
                    <p>5. 대리 제출 및 대리 수령이 불가함을 확인합니다.</p>
                    <p>6. 학과 규정 및 기자재실 운영 지침을 준수합니다.</p>
                    <p>
                      7. 허위 정보로 대여 신청할 경우 대여가 취소될 수 있습니다.
                    </p>
                    <p>
                      8. 기자재 반납 시 정상 동작 여부 확인 절차에 협조합니다.
                    </p>

                    <div className="mt-6 rounded-md bg-neutral-100 p-3">
                      위 내용을 모두 확인한 뒤 아래 체크박스를 선택해주세요.
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="pledge-dialog-agree"
                      checked={isPledgeAgreed}
                      onCheckedChange={(checked) =>
                        setIsPledgeAgreed(checked === true)
                      }
                    />
                    <Label
                      htmlFor="pledge-dialog-agree"
                      className="text-sm text-black"
                    >
                      위 내용을 확인했고 동의합니다.
                    </Label>
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => setPledgeDialogOpen(false)}
                      className="cursor-pointer"
                    >
                      닫기
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer"
                      onClick={() => setPledgeDialogOpen(false)}
                      disabled={!isPledgeAgreed}
                    >
                      확인
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
        <AlertDialog open={pledgeDialogOpen} onOpenChange={setPledgeDialogOpen}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>기자재 대여 서약 조항</AlertDialogTitle>
              <AlertDialogDescription className="text-left break-keep">
                아래 조항을 반드시 확인해주세요.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="max-h-[420px] overflow-y-auto rounded-md border p-4 text-sm leading-7 text-black">
              <p>
                1. 대여한 기자재는 본인만 사용하며 타인에게 양도하거나 대여하지
                않습니다.
              </p>
              <p>
                2. 대여 기자재의 분실, 파손, 침수, 임의 개조 시 관련 규정에 따라
                책임을 부담합니다.
              </p>
              <p>
                3. 반납 기한을 준수하며, 미반납 시 경고 메일 발송 및 패널티
                부여에 동의합니다.
              </p>
              <p>4. 방학 중 대여 및 연장이 제한될 수 있음을 확인합니다.</p>
              <p>5. 대리 제출 및 대리 수령이 불가함을 확인합니다.</p>
              <p>6. 학과 규정 및 기자재실 운영 지침을 준수합니다.</p>
              <p>7. 허위 정보로 대여 신청할 경우 대여가 취소될 수 있습니다.</p>
              <p>8. 기자재 반납 시 정상 동작 여부 확인 절차에 협조합니다.</p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="pledge-dialog-agree"
                checked={isPledgeAgreed}
                onCheckedChange={(checked) =>
                  setIsPledgeAgreed(checked === true)
                }
              />
              <Label
                htmlFor="pledge-dialog-agree"
                className="text-sm text-black"
              >
                위 내용을 확인했고 동의합니다.
              </Label>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setPledgeDialogOpen(false)}
                className="cursor-pointer"
              >
                닫기
              </AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer"
                onClick={() => setPledgeDialogOpen(false)}
                disabled={!isPledgeAgreed}
              >
                확인
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Lend;
