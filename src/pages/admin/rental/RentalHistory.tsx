import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock3, Search, X } from "lucide-react";
import { useModels } from "../../../api/adminModel.api";
import { useAdminItemHistory, useAdminItemsByModel } from "../../../api/adminItem.api";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Input } from "../../../components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table";
import type {
  AdminItem, ItemRentalHistoryEntry, ItemState,
} from "../../../type/adminItem.type";
import type { ModelItem } from "../../../type/adminModel.type";

const PAGE_SIZE = 15;

const stateMeta: Record<ItemState, { label: string; className: string }> = {
  AVAILABLE: { label: "대여 가능", className: "text-green-300" },
  RESERVED: { label: "예약 중", className: "text-yellow-300" },
  RENTED: { label: "대여 중", className: "text-blue-300" },
  BREAKDOWN: { label: "고장", className: "text-orange-300" },
  LOST: { label: "분실", className: "text-red-300" },
};

const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString("ko-KR") : "-";

const formatDuration = (minutes: number) => {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const rest = minutes % 60;
  return [
    days > 0 ? `${days}일` : "",
    hours > 0 ? `${hours}시간` : "",
    rest > 0 || minutes === 0 ? `${rest}분` : "",
  ].filter(Boolean).join(" ");
};

const RentalHistory = () => {
  const [modelKeyword, setModelKeyword] = useState("");
  const [serialKeyword, setSerialKeyword] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  const [selectedRental, setSelectedRental] = useState<ItemRentalHistoryEntry | null>(null);
  const [historyPage, setHistoryPage] = useState(0);

  const modelsQuery = useModels();
  const itemsQuery = useAdminItemsByModel(selectedModel?.modelId);
  const historyQuery = useAdminItemHistory(
    selectedItem?.itemId, historyPage, PAGE_SIZE, !!selectedItem,
  );

  const models = useMemo(() => {
    const keyword = modelKeyword.trim().toLowerCase();
    return ((modelsQuery.data ?? []) as ModelItem[])
      .filter((model) => model.type === "EQUIPMENT")
      .filter((model) => !keyword || [
        model.categoryName, model.name, model.displayName, model.subName,
      ].some((value) => value?.toLowerCase().includes(keyword)));
  }, [modelKeyword, modelsQuery.data]);

  const items = useMemo(() => {
    const keyword = serialKeyword.trim().toLowerCase();
    return ((itemsQuery.data ?? []) as AdminItem[])
      .filter((item) => !keyword || item.serial.toLowerCase().includes(keyword));
  }, [itemsQuery.data, serialKeyword]);

  useEffect(() => {
    setSerialKeyword("");
    setSelectedItem(null);
    setSelectedRental(null);
    setHistoryPage(0);
  }, [selectedModel?.modelId]);

  useEffect(() => {
    setSelectedRental(null);
    setHistoryPage(0);
  }, [selectedItem?.itemId]);

  const goToModels = () => {
    setSelectedModel(null);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-full w-full bg-[#060a0c] px-8 pb-16 text-white">
      <div className="pt-14">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-white hover:text-gray-100" href="/admin">홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {selectedModel && (
              <>
                <BreadcrumbItem>
                  <button type="button" className="text-white hover:text-gray-100" onClick={goToModels}>
                    대여 기록 관리
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            {selectedItem && (
              <>
                <BreadcrumbItem>
                  <button type="button" className="text-white hover:text-gray-100" onClick={() => setSelectedItem(null)}>
                    {selectedModel?.displayName || selectedModel?.name}
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                {selectedItem ? selectedItem.serial : selectedModel ? selectedModel.displayName || selectedModel.name : "대여 기록 관리"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="flex items-end justify-between gap-6 pb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {selectedItem ? "시리얼 대여 이력" : selectedModel ? "시리얼별 대여 기록" : "대여 기록 관리"}
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              {selectedItem
                ? `${selectedModel?.displayName || selectedModel?.name} · ${selectedItem.serial}의 전체 대여 기록입니다.`
                : selectedModel
                  ? "시리얼을 선택하면 해당 기자재를 빌렸던 사용자 전체를 확인할 수 있습니다."
                  : "기자재 종류를 선택해 시리얼별 대여·반납 기록을 확인합니다."}
            </p>
          </div>
          {selectedItem ? (
            <button type="button" onClick={() => setSelectedItem(null)}
              className="shrink-0 rounded-sm border border-neutral-400 px-3 py-1 text-sm text-neutral-200 hover:bg-neutral-800">
              시리얼 목록
            </button>
          ) : selectedModel ? (
            <button type="button" onClick={goToModels}
              className="shrink-0 rounded-sm border border-neutral-400 px-3 py-1 text-sm text-neutral-200 hover:bg-neutral-800">
              기자재 목록
            </button>
          ) : null}
        </div>

        {!selectedModel && (
          <>
            <Toolbar
              value={modelKeyword}
              onChange={setModelKeyword}
              placeholder="기자재명, 모델명 또는 카테고리 검색"
              resultLabel={`총 ${models.length}종`}
            />
            <DataTable>
              <TableHeader className="border-b border-neutral-700 bg-[#11141b]">
                <TableRow className="border-neutral-700 hover:bg-[#11141b]">
                  <Head>카테고리</Head>
                  <Head>기자재명</Head>
                  <Head>내부 모델명</Head>
                  <Head>전체</Head>
                  <Head>대여 가능</Head>
                  <Head>예약 중</Head>
                  <Head>대여 중</Head>
                  <Head>고장/분실</Head>
                  <TableHead className="w-14" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelsQuery.isLoading ? <EmptyRow columns={9} text="기자재를 불러오는 중입니다." />
                  : modelsQuery.isError ? <EmptyRow columns={9} text="기자재 목록을 불러오지 못했습니다." error />
                  : models.length === 0 ? <EmptyRow columns={9} text="조건에 맞는 기자재가 없습니다." />
                  : models.map((model) => (
                    <TableRow key={model.modelId} tabIndex={0} role="button"
                      onClick={() => setSelectedModel(model)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") setSelectedModel(model);
                      }}
                      className="cursor-pointer border-neutral-800 text-center hover:bg-white/[0.04]">
                      <TableCell>{model.categoryName}</TableCell>
                      <TableCell className="font-semibold">{model.displayName || model.name}</TableCell>
                      <TableCell className="text-neutral-400">{model.name}</TableCell>
                      <NumberCell value={model.totalQty} />
                      <NumberCell value={model.availableQty} className="text-green-300" />
                      <NumberCell value={model.reservedQty} className="text-yellow-300" />
                      <NumberCell value={model.rentedQty} className="text-blue-300" />
                      <TableCell className="tabular-nums text-neutral-400">
                        {model.breakdownQty + model.lostQty}
                      </TableCell>
                      <TableCell><ChevronRight className="h-4 w-4 text-neutral-500" /></TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </DataTable>
          </>
        )}

        {selectedModel && !selectedItem && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              <Summary label="전체" value={selectedModel.totalQty} />
              <Summary label="대여 가능" value={selectedModel.availableQty} color="text-green-300" />
              <Summary label="예약 중" value={selectedModel.reservedQty} color="text-yellow-300" />
              <Summary label="대여 중" value={selectedModel.rentedQty} color="text-blue-300" />
              <Summary label="고장" value={selectedModel.breakdownQty} color="text-orange-300" />
              <Summary label="분실" value={selectedModel.lostQty} color="text-red-300" />
            </div>
            <Toolbar value={serialKeyword} onChange={setSerialKeyword}
              placeholder="시리얼 번호 검색" resultLabel={`총 ${items.length}개`} />
            <DataTable>
              <TableHeader className="border-b border-neutral-700 bg-[#11141b]">
                <TableRow className="border-neutral-700 hover:bg-[#11141b]">
                  <Head>시리얼 번호</Head>
                  <Head>현재 상태</Head>
                  <Head>취득일</Head>
                  <Head>등록일</Head>
                  <Head>최근 수정일</Head>
                  <TableHead className="w-14" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {itemsQuery.isLoading ? <EmptyRow columns={6} text="시리얼을 불러오는 중입니다." />
                  : itemsQuery.isError ? <EmptyRow columns={6} text="시리얼 목록을 불러오지 못했습니다." error />
                  : items.length === 0 ? <EmptyRow columns={6} text="조건에 맞는 시리얼이 없습니다." />
                  : items.map((item) => (
                    <TableRow key={item.itemId} tabIndex={0} role="button"
                      onClick={() => setSelectedItem(item)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") setSelectedItem(item);
                      }}
                      className="cursor-pointer border-neutral-800 text-center hover:bg-white/[0.04]">
                      <TableCell className="font-mono font-semibold">{item.serial}</TableCell>
                      <TableCell className={stateMeta[item.state].className}>{stateMeta[item.state].label}</TableCell>
                      <TableCell className="text-neutral-400">{item.acquiredAt || "-"}</TableCell>
                      <TableCell className="text-neutral-400">{formatDateTime(item.createdAt)}</TableCell>
                      <TableCell className="text-neutral-400">{formatDateTime(item.updatedAt)}</TableCell>
                      <TableCell><ChevronRight className="h-4 w-4 text-neutral-500" /></TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </DataTable>
          </>
        )}

        {selectedItem && (
          <>
            <div className="mb-6 flex items-center justify-between border border-neutral-700 bg-[#0d1117] px-5 py-4">
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-xs text-neutral-500">시리얼 번호</p>
                  <p className="mt-1 font-mono text-lg font-semibold">{selectedItem.serial}</p>
                </div>
                <div className="h-9 w-px bg-neutral-700" />
                <div>
                  <p className="text-xs text-neutral-500">현재 상태</p>
                  <p className={`mt-1 text-sm font-medium ${stateMeta[selectedItem.state].className}`}>
                    {stateMeta[selectedItem.state].label}
                  </p>
                </div>
              </div>
              <p className="text-sm text-neutral-400">
                전체 <span className="font-semibold text-white">{historyQuery.data?.histories.totalElements ?? 0}</span>건
              </p>
            </div>
            <DataTable>
              <TableHeader className="border-b border-neutral-700 bg-[#11141b]">
                <TableRow className="border-neutral-700 hover:bg-[#11141b]">
                  <Head>상태</Head>
                  <Head>대여자</Head>
                  <Head>학번</Head>
                  <Head>이메일</Head>
                  <Head>학기/구분</Head>
                  <Head>대여 일시</Head>
                  <Head>반납 일시</Head>
                  <Head>점유 기간</Head>
                  <TableHead className="w-14" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyQuery.isLoading && !historyQuery.data
                  ? <EmptyRow columns={9} text="대여 이력을 불러오는 중입니다." />
                  : historyQuery.isError
                    ? <EmptyRow columns={9} text="대여 이력을 불러오지 못했습니다." error />
                    : !historyQuery.data?.histories.content.length
                      ? <EmptyRow columns={9} text="이 시리얼의 대여 기록이 없습니다." />
                      : historyQuery.data.histories.content.map((entry) => (
                        <TableRow key={entry.rentalId} tabIndex={0} role="button"
                          onClick={() => setSelectedRental(entry)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") setSelectedRental(entry);
                          }}
                          className="cursor-pointer border-neutral-800 text-center hover:bg-white/[0.04]">
                          <TableCell className={entry.currentlyRenting ? "text-blue-300" : "text-neutral-300"}>
                            {entry.currentlyRenting ? "대여 중" : "반납 완료"}
                          </TableCell>
                          <TableCell className="font-semibold">{entry.username}</TableCell>
                          <TableCell>{entry.studentId}</TableCell>
                          <TableCell className="text-neutral-400">{entry.email}</TableCell>
                          <TableCell>{entry.semester}{entry.specialRental ? " · 특별" : ""}</TableCell>
                          <TableCell className="text-neutral-400">{formatDateTime(entry.rentedAt)}</TableCell>
                          <TableCell className="text-neutral-400">{entry.returnedAt ? formatDateTime(entry.returnedAt) : "-"}</TableCell>
                          <TableCell>{formatDuration(entry.occupiedMinutes)}</TableCell>
                          <TableCell><ChevronRight className="h-4 w-4 text-neutral-500" /></TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </DataTable>
            {(historyQuery.data?.histories.totalPages ?? 0) > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <PageButton label="이전" disabled={historyPage === 0}
                  onClick={() => setHistoryPage((page) => page - 1)} icon={<ChevronLeft className="h-4 w-4" />} />
                <span className="min-w-20 text-center text-sm text-neutral-400">
                  {historyPage + 1} / {historyQuery.data?.histories.totalPages}
                </span>
                <PageButton label="다음"
                  disabled={historyPage + 1 >= (historyQuery.data?.histories.totalPages ?? 0)}
                  onClick={() => setHistoryPage((page) => page + 1)} icon={<ChevronRight className="h-4 w-4" />} />
              </div>
            )}
          </>
        )}
      </div>

      {selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onMouseDown={() => setSelectedRental(null)}>
          <section role="dialog" aria-modal="true" aria-label="대여 상세 정보"
            onMouseDown={(event) => event.stopPropagation()}
            className="w-full max-w-3xl border border-neutral-600 bg-[#11141b] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-400">대여 상세 정보</p>
                <h2 className="mt-1 text-xl font-semibold">
                  {selectedRental.username} · {selectedItem?.serial}
                </h2>
              </div>
              <button type="button" aria-label="닫기" onClick={() => setSelectedRental(null)}
                className="p-1 text-neutral-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 grid gap-x-10 gap-y-5 border-y border-neutral-700 py-6 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label="대여자" value={selectedRental.username} sub={selectedRental.studentId} />
              <Detail label="이메일" value={selectedRental.email} />
              <Detail label="학기 / 구분"
                value={selectedRental.specialRental ? `${selectedRental.semester} · 특별 대여` : selectedRental.semester} />
              <Detail label="대여 일시" value={formatDateTime(selectedRental.rentedAt)} />
              <Detail label="반납 일시"
                value={selectedRental.returnedAt ? formatDateTime(selectedRental.returnedAt) : "현재 대여 중"} />
              <Detail label="총 점유 기간" value={formatDuration(selectedRental.occupiedMinutes)}
                sub={`24시간 기준 ${selectedRental.occupiedDays}일`} icon />
            </div>
            <div className="mt-5 flex justify-end">
              <button type="button" onClick={() => setSelectedRental(null)}
                className="rounded-sm border border-neutral-400 px-4 py-1.5 text-sm hover:bg-neutral-800">닫기</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const Toolbar = ({ value, onChange, placeholder, resultLabel }: {
  value: string; onChange: (value: string) => void; placeholder: string; resultLabel: string;
}) => (
  <div className="mb-5 flex items-center justify-between gap-4">
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      <Input value={value} onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder} className="border-neutral-700 bg-[#080c10] pl-9" />
    </div>
    <span className="shrink-0 text-sm text-neutral-400">{resultLabel}</span>
  </div>
);
const DataTable = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-x-auto border border-neutral-700"><Table className="min-w-[900px]">{children}</Table></div>
);
const Head = ({ children }: { children: React.ReactNode }) => (
  <TableHead className="text-center font-medium text-white">{children}</TableHead>
);
const EmptyRow = ({ columns, text, error = false }: { columns: number; text: string; error?: boolean }) => (
  <TableRow><TableCell colSpan={columns} className={`py-16 text-center ${error ? "text-red-300" : "text-neutral-400"}`}>{text}</TableCell></TableRow>
);
const NumberCell = ({ value, className = "" }: { value: number; className?: string }) => (
  <TableCell className={`tabular-nums ${className}`}>{value}</TableCell>
);
const Summary = ({ label, value, color = "" }: { label: string; value: number; color?: string }) => (
  <div className="border border-neutral-700 bg-[#0d1117] px-4 py-3 text-center">
    <p className={`text-xl font-semibold tabular-nums ${color}`}>{value}</p>
    <p className="mt-1 text-xs text-neutral-500">{label}</p>
  </div>
);
const PageButton = ({ label, disabled, onClick, icon }: {
  label: string; disabled: boolean; onClick: () => void; icon: React.ReactNode;
}) => (
  <button type="button" disabled={disabled} onClick={onClick}
    className="flex items-center gap-1 border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40">
    {label === "이전" && icon}{label}{label === "다음" && icon}
  </button>
);
const Detail = ({ label, value, sub, icon = false }: {
  label: string; value: string; sub?: string; icon?: boolean;
}) => (
  <div>
    <p className="text-sm text-neutral-500">{label}</p>
    <p className="mt-1 flex items-center gap-1.5 text-sm">
      {icon && <Clock3 className="h-4 w-4 text-neutral-500" />}{value || "-"}
    </p>
    {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
  </div>
);

export default RentalHistory;
