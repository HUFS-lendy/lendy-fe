import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
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
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import { useModels } from "../api/model.api";
import type { ModelItem } from "../type/model.type";
import { useDoReserve } from "../api/reservationUser.api";
import { clearReservationAdmission, getReservationAdmission } from "../lib/reservationAdmission";
import { mergeRentalGroupModels } from "../lib/equipmentInfo";

type EquipmentGroupKey = "GALAXY_BOOK" | "GALAXY_TAB" | "IPAD" | "LENOVO" | "OTHER";
const EQUIPMENT_GROUPS: Array<{ key: EquipmentGroupKey; title: string; description: string }> = [
  { key: "GALAXY_BOOK", title: "갤럭시 북", description: "프로그래밍 및 문서 작업용 노트북" },
  { key: "GALAXY_TAB", title: "갤럭시 탭", description: "S Pen을 활용할 수 있는 안드로이드 태블릿" },
  { key: "IPAD", title: "아이패드", description: "강의 자료 열람 및 학습용 태블릿" },
  { key: "LENOVO", title: "레노버 노트북", description: "기본 학업 및 문서 작업용 노트북" },
  { key: "OTHER", title: "기타 기자재", description: "그 밖의 대여 가능 기자재" },
];
const equipmentText = (item: ModelItem) => `${item.name} ${item.displayName || ""} ${item.subName || ""}`.toLowerCase();
const equipmentGroup = (item: ModelItem): EquipmentGroupKey => {
  const value = equipmentText(item);
  if (value.includes("ipad") || value.includes("air 2") || value.includes("air 3")) return "IPAD";
  if (value.includes("s3 9.7") || value.includes("s8") || value.includes("galaxy tab") || value.includes("갤럭시 탭")) return "GALAXY_TAB";
  if (value.includes("thinkpad") || value.includes("s440") || value.includes("e460") || value.includes("레노버")) return "LENOVO";
  if (value.includes("galaxy book") || value.includes("갤럭시 북") || value.includes("nt951") || value.includes("nt961") || value.includes("i5형") || value.includes("16형")) return "GALAXY_BOOK";
  return "OTHER";
};
const equipmentRank = (item: ModelItem) => {
  const value = equipmentText(item);
  if (value.includes("book3") || value.includes("nt961") || value.includes("16형")) return 100;
  if (value.includes("book2") || value.includes("nt951") || value.includes("i5형")) return 90;
  if (value.includes("s8")) return 80;
  if (value.includes("s3")) return 70;
  if (value.includes("air 3")) return 60;
  if (value.includes("air 2")) return 50;
  if (value.includes("e460")) return 40;
  if (value.includes("s440")) return 30;
  return 0;
};
const reservationModelName = (item: ModelItem, group: EquipmentGroupKey) => {
  if (item.studentDisplayName?.trim()) return item.studentDisplayName.trim();
  const value = equipmentText(item);
  if (group === "GALAXY_BOOK") {
    if (value.includes("book3") || value.includes("nt961") || value.includes("16형")) return "갤럭시 북 3 Pro";
    if (value.includes("book2") || value.includes("nt951") || value.includes("i5형")) return "갤럭시 북 2 Pro";
  }
  if (group === "GALAXY_TAB") return value.includes("s8") ? "S8" : value.includes("s3") ? "S3" : item.subName || item.name;
  if (group === "IPAD") return value.includes("air 3") ? "Air 3" : value.includes("air 2") ? "Air 2" : item.subName || item.name;
  if (group === "LENOVO") return value.includes("e460") ? "ThinkPad E460" : value.includes("s440") ? "ThinkPad S440" : item.subName || item.name;
  return item.subName || item.displayName || item.name;
};
export type ReservationPreviewState = "selection" | "confirm" | "pledge" | "success" | "limit" | "failure";
const RESERVATION_SUCCESS_MESSAGE = "예약하신 기자재는 영업일 기준 3일 이내에 컴퓨터공학부 과사무실(공학관 206호)에서 수령해 주시기 바랍니다.\n기한 내 수령하지 않을 경우 예약은 자동으로 취소됩니다.\n예약 내용은 이메일로 전송되었습니다.";
const PREVIEW_MODELS: ModelItem[] = [
  { modelId: 9001, categoryId: 1, categoryName: "노트북", type: "EQUIPMENT", name: "GRAM", displayName: "노트북", subName: "LG gram", description: "수업 및 프로젝트용 노트북", visibleToUsers: true, courseName: null, availableQty: 12 },
  { modelId: 9002, categoryId: 2, categoryName: "태블릿", type: "EQUIPMENT", name: "IPAD", displayName: "태블릿 PC", subName: "iPad", description: "필기와 실습에 사용할 수 있는 태블릿", visibleToUsers: true, courseName: null, availableQty: 8 },
  { modelId: 9003, categoryId: 3, categoryName: "카메라", type: "EQUIPMENT", name: "CAMERA", displayName: "카메라", subName: "Sony Alpha", description: "촬영 및 콘텐츠 제작용 카메라", visibleToUsers: true, courseName: null, availableQty: 3 },
];

const Lend = ({ embedded = false, preview = false, previewState = "selection" }: { embedded?: boolean; preview?: boolean; previewState?: ReservationPreviewState }) => {
  const navigate = useNavigate();

  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [isPledgeAgreed, setIsPledgeAgreed] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [resultDialog, setResultDialog] = useState<{ type: "success" | "limit" | "error"; message: string } | null>(null);

  const { data: serverModels = [], isLoading: modelsLoading, isError: modelsError } = useModels();
  const { mutate: createReservation, isPending: isCreatingReservation } = useDoReserve();
  const previewServerModels = serverModels.filter((item) => item.type === "EQUIPMENT" && item.visibleToUsers);
  const models = preview ? (previewServerModels.length > 0 ? serverModels : PREVIEW_MODELS) : serverModels;
  const isLoading = preview ? modelsLoading && serverModels.length === 0 : modelsLoading;
  const isError = preview ? false : modelsError;

  const equipmentList = useMemo(() => {
    return mergeRentalGroupModels(models.filter(
      (item: ModelItem) => item.type === "EQUIPMENT" && item.visibleToUsers,
    ));
  }, [models]);

  const groupedEquipment = useMemo(() => EQUIPMENT_GROUPS.map((group) => ({
    ...group,
    items: equipmentList.filter((item) => equipmentGroup(item) === group.key).sort((a, b) => equipmentRank(b) - equipmentRank(a)),
  })).filter((group) => group.items.length > 0), [equipmentList]);

  const selectedEquipment =
    equipmentList.find((item: ModelItem) => item.modelId === selectedModelId) ??
    null;

  useEffect(() => {
    if (!preview) return;
    if (["confirm", "pledge", "success", "limit", "failure"].includes(previewState)) setSelectedModelId(equipmentList[0]?.modelId ?? PREVIEW_MODELS[0].modelId);
    setReservationDialogOpen(previewState === "confirm");
    setPledgeDialogOpen(previewState === "pledge");
    setIsPledgeAgreed(previewState === "success");
    setResultDialog(previewState === "success"
      ? { type: "success", message: RESERVATION_SUCCESS_MESSAGE }
      : previewState === "limit"
        ? { type: "limit", message: "한 학기에는 기자재를 1대만 예약하거나 대여할 수 있습니다." }
      : previewState === "failure"
        ? { type: "error", message: "선택한 기자재의 예약 가능 수량이 부족합니다." }
        : null);
  }, [equipmentList, preview, previewState]);

  const handleSelectModel = (modelId: number, checked: boolean) => {
    setSelectedModelId(checked ? modelId : null);
    setIsPledgeAgreed(false);
  };

  const handleReserveEquipment = () => {
    if (!selectedModelId) {
      toast("대여할 기자재를 선택해주세요.");
      return;
    }

    if (preview) {
      setReservationDialogOpen(false);
      setResultDialog({ type: "success", message: RESERVATION_SUCCESS_MESSAGE });
      return;
    }

    createReservation(
      { modelId: selectedModelId, modelGroupKey: selectedEquipment?.rentalGroupKey, admissionToken: getReservationAdmission() },
      {
        onSuccess: () => {
          clearReservationAdmission();
          setReservationDialogOpen(false);
          setResultDialog({ type: "success", message: RESERVATION_SUCCESS_MESSAGE });
        },
        onError: (error) => {
          const message = error instanceof Error ? error.message : "대여 신청에 실패했습니다.";
          if (message.includes("입장권")) {
            clearReservationAdmission();
            navigate("/reservation", { replace: true });
          }
          setReservationDialogOpen(false);
          const isSemesterLimit = message.includes("동일 기자재 유형") || message.includes("1개만 예약/대여") || message.includes("한 학기에는");
          setResultDialog({ type: isSemesterLimit ? "limit" : "error", message });
        },
      },
    );
  };

  return (
    <div className={embedded ? "w-full" : "bg-[#060a0c] w-screen min-h-screen px-8"}>
      {!embedded && <div className="pt-20">
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
      </div>}

      <div className={embedded ? "" : "pt-8"}>
        <div className="flex items-center justify-between pb-8">
          <div className="font-bold text-white text-3xl">기자재 대여 신청</div>
          <a href="/equipment-guide" target="_blank" className="rounded-md border border-neutral-600 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white">
            모델 비교 안내
          </a>
        </div>

        <div className="mt-4">
          <AlertDialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
              <div className="mb-5 flex min-h-11 items-center justify-between rounded-lg border border-neutral-800 bg-[#0b1014] px-4 py-2">
                <p className="text-sm text-neutral-400">
                  {selectedEquipment ? <><span className="mr-2 text-neutral-500">선택한 기자재</span><strong className="text-white">{reservationModelName(selectedEquipment, equipmentGroup(selectedEquipment))}</strong></> : "대여할 기자재 한 종류를 선택해주세요."}
                </p>
                <button
                  type="button"
                  disabled={!selectedModelId || isCreatingReservation}
                  className="ml-4 shrink-0 cursor-pointer rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-30"
                  onClick={() => setReservationDialogOpen(true)}
                >
                  선택 완료
                </button>
              </div>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="pb-4">
                  기자재를 대여하시겠습니까?
                </AlertDialogTitle>

                <AlertDialogDescription className="break-keep text-left">
                  {selectedEquipment && (
                    <div className="mb-4 text-black">
                      선택 항목:{" "}
                      <strong>
                        {reservationModelName(selectedEquipment, equipmentGroup(selectedEquipment))}
                      </strong>
                    </div>
                  )}

                  <div className="text-black">
                    반납 기한은 해당 <span className="font-bold">학기 종강일</span>
                    까지이며, 기한 내 미반납 시 일주일 간 이메일로 경고 메일이
                    발송되며 대여 서비스 내 패널티가 부여될 수 있습니다.
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

          {isLoading && <div className="rounded-xl border border-neutral-800 py-16 text-center text-neutral-400">기자재 목록을 불러오는 중입니다.</div>}
          {isError && <div className="rounded-xl border border-red-400/30 py-16 text-center text-red-400">기자재 목록을 불러오지 못했습니다.</div>}
          {!isLoading && !isError && equipmentList.length === 0 && <div className="rounded-xl border border-neutral-800 py-16 text-center text-neutral-400">대여 가능한 기자재가 없습니다.</div>}

          {!isLoading && !isError && <div className="space-y-4">
            {groupedEquipment.map((group) => <section key={group.key} className="overflow-hidden rounded-lg border border-neutral-700/90 bg-[#090d10] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <div className="flex min-h-14 items-center justify-between border-b border-neutral-700 bg-[#11171c] px-5 py-3">
                <div className="flex min-w-0 items-center gap-4"><span className="h-7 w-1 rounded-full bg-neutral-200" aria-hidden="true" /><h2 className="shrink-0 text-lg font-bold text-white">{group.title}</h2><p className="truncate text-xs text-neutral-400">{group.description}</p></div>
                <span className="ml-4 shrink-0 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] text-neutral-400">{group.items.length}개 모델</span>
              </div>
              <div>
                {group.items.map((item) => {
                  const selected = selectedModelId === item.modelId;
                  return <div key={item.modelId} onClick={() => { setSelectedModelId(selected ? null : item.modelId); setIsPledgeAgreed(false); }} className={`grid min-h-[58px] cursor-pointer grid-cols-[40px_minmax(0,1fr)_88px] items-center border-b border-neutral-800/90 px-4 py-2.5 transition-colors last:border-b-0 md:grid-cols-[48px_minmax(180px,0.9fr)_minmax(240px,1.4fr)_112px] md:px-5 ${selected ? "bg-white/[0.1] shadow-[inset_3px_0_0_#fff]" : "odd:bg-white/[0.012] hover:bg-white/[0.045]"}`}>
                    <Checkbox className="border-neutral-400 data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-black" checked={selected} onCheckedChange={(checked) => handleSelectModel(item.modelId, checked === true)} onClick={(e) => e.stopPropagation()} />
                    <div className="min-w-0"><p className="truncate text-[15px] font-semibold text-white">{reservationModelName(item, group.key)}</p></div>
                    <p className="hidden truncate border-l border-neutral-800 px-5 text-sm font-medium text-white md:block">{item.description || "상세 정보 준비 중"}</p>
                    <div className="justify-self-end text-right text-[15px] font-bold text-white"><span>잔여 </span><span>{item.availableQty}대</span></div>
                  </div>;
                })}
              </div>
            </section>)}
          </div>}
        </div>

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

        <AlertDialog open={resultDialog !== null} onOpenChange={(open) => { if (!open) setResultDialog(null); }}>
          <AlertDialogContent className="max-w-lg border-white/15 bg-[#0c1217] p-0 text-white shadow-[0_28px_100px_rgba(0,0,0,0.55)]">
            <div className="px-8 pb-8 pt-9 text-center">
            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${resultDialog?.type === "success" ? "bg-emerald-400/15 text-emerald-400" : resultDialog?.type === "limit" ? "bg-amber-400/15 text-amber-300" : "bg-red-400/15 text-red-400"}`}>
              {resultDialog?.type === "success" ? "✓" : "!"}
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="mt-3 text-center text-2xl text-white">{resultDialog?.type === "success" ? "예약이 완료되었습니다" : resultDialog?.type === "limit" ? "학기당 예약 가능 수량을 초과했습니다" : "예약 신청이 완료되지 않았습니다"}</AlertDialogTitle>
            </AlertDialogHeader>
            {resultDialog?.type === "success" ? (
              <div className="mt-7 text-left">
                <div className="grid grid-cols-[110px_1fr] gap-y-4 border-y border-white/10 px-2 py-5 text-sm">
                  <span className="text-neutral-500">수령 기한</span><strong className="font-semibold text-white">영업일 기준 3일 이내</strong>
                  <span className="text-neutral-500">수령 장소</span><strong className="font-semibold leading-6 text-white">공학관 206호<br />컴퓨터공학부 과사무실</strong>
                </div>
                <div className="mt-4 border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-sm leading-6 text-red-300">
                  기한 내 수령하지 않을 경우 예약은 자동으로 취소됩니다.
                </div>
                <p className="mt-4 text-center text-sm text-neutral-500">예약 내용은 등록된 이메일로 전송되었습니다.</p>
              </div>
            ) : resultDialog?.type === "limit" ? (
              <div className="mt-7 text-left">
                <div className="border-y border-white/10 px-2 py-5">
                  <p className="text-sm font-semibold text-white">한 학기 1인 1기자재 이용 원칙</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">한 학기에는 노트북과 태블릿 PC 중 한 종류만 예약하거나 대여할 수 있습니다.</p>
                </div>
                <div className="mt-4 border border-amber-300/20 bg-amber-300/[0.07] px-4 py-3 text-sm leading-6 text-amber-200">
                  다른 기자재를 예약하려면 기존 예약을 먼저 취소해 주세요. 이미 수령한 기자재는 반납 처리 후 예약할 수 있습니다.
                </div>
              </div>
            ) : <AlertDialogDescription className="mt-5 whitespace-pre-line text-center leading-6 text-neutral-400">{resultDialog?.message}</AlertDialogDescription>}
            <AlertDialogFooter className="sm:justify-center">
              <AlertDialogAction onClick={() => { setResultDialog(null); if (!preview && resultDialog?.type === "success") navigate("/lending-state"); }} className="mt-3 min-w-32 bg-white text-black hover:bg-neutral-200">확인</AlertDialogAction>
            </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Lend;
