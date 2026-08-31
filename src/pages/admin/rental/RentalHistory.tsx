import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { useAdminRentalHistory } from "../../../api/adminRental.api";
import type { AdminRentalHistoryItem } from "../../../type/adminRental.type";

const PAGE_SIZE = 20;
const formatDateTime = (value?: string | null) =>
  value ? new Date(value).toLocaleString("ko-KR") : "-";
const formatDuration = (minutes: number) => {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  return `${days}일 ${hours}시간 ${mins}분`;
};
const statusLabel = (status: AdminRentalHistoryItem["status"]) =>
  status === "RETURNED" ? "반납 완료" : status === "OVERDUE" ? "연체" : "대여 중";

const RentalHistory = () => {
  const [keyword, setKeyword] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("");
  const [rentalType, setRentalType] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<AdminRentalHistoryItem | null>(null);

  const specialRental = rentalType === "SPECIAL" ? true : rentalType === "NORMAL" ? false : undefined;
  const { data, isLoading, isError } = useAdminRentalHistory({
    keyword, semester, status, specialRental, page, size: PAGE_SIZE,
  });
  const rows = data?.content ?? [];
  const pages = useMemo(() => Array.from({ length: data?.totalPages ?? 0 }, (_, i) => i), [data?.totalPages]);

  const resetPage = () => { setPage(0); setSelected(null); };

  return (
    <div className="min-h-full w-full bg-[#060a0c] px-8 pb-16 text-white">
      <div className="pt-14 text-sm text-neutral-500">홈 〉 대여 기록 관리</div>
      <div className="flex items-end justify-between pb-8 pt-8">
        <div>
          <h1 className="text-3xl font-bold">대여 기록 관리</h1>
          <p className="mt-2 text-sm text-neutral-400">전체 기자재의 대여·반납 이력을 검색하고 상세 점유 기간을 확인합니다.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">검색 결과</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{data?.totalElements?.toLocaleString() ?? 0}건</p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 border border-white/10 bg-[#0d1117] p-4 lg:grid-cols-[minmax(280px,1fr)_180px_160px_160px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input value={keyword} onChange={(e) => { setKeyword(e.target.value); resetPage(); }}
            placeholder="시리얼, 모델명, 이름, 학번 또는 이메일" className="border-neutral-700 bg-[#080c10] pl-9" />
        </div>
        <Input value={semester} onChange={(e) => { setSemester(e.target.value); resetPage(); }}
          placeholder="학기 예: 2026-1" className="border-neutral-700 bg-[#080c10]" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); resetPage(); }} className="rounded-md border border-neutral-700 bg-[#080c10] px-3 text-sm">
          <option value="">전체 상태</option><option value="RENTING">대여 중</option><option value="OVERDUE">연체</option><option value="RETURNED">반납 완료</option>
        </select>
        <select value={rentalType} onChange={(e) => { setRentalType(e.target.value); resetPage(); }} className="rounded-md border border-neutral-700 bg-[#080c10] px-3 text-sm">
          <option value="">전체 구분</option><option value="NORMAL">일반 대여</option><option value="SPECIAL">특별 대여</option>
        </select>
      </div>

      <div className="overflow-hidden border border-neutral-700">
        <Table className="text-center">
          <TableHeader className="bg-[#11141b]">
            <TableRow className="border-neutral-700 hover:bg-[#11141b]">
              <TableHead className="text-center text-white">상태</TableHead><TableHead className="text-center text-white">기자재</TableHead>
              <TableHead className="text-center text-white">시리얼</TableHead><TableHead className="text-center text-white">대여자</TableHead>
              <TableHead className="text-center text-white">학기/구분</TableHead><TableHead className="text-center text-white">대여 시각</TableHead>
              <TableHead className="text-center text-white">반납 시각</TableHead><TableHead className="text-center text-white">상세</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !data ? <TableRow><TableCell colSpan={8} className="py-12 text-neutral-400">불러오는 중...</TableCell></TableRow>
              : isError ? <TableRow><TableCell colSpan={8} className="py-12 text-red-300">대여 기록을 불러오지 못했습니다.</TableCell></TableRow>
              : rows.length === 0 ? <TableRow><TableCell colSpan={8} className="py-12 text-neutral-400">조건에 맞는 대여 기록이 없습니다.</TableCell></TableRow>
              : rows.map((row) => <TableRow key={row.rentalId} className="border-neutral-800 hover:bg-white/[0.03]">
                <TableCell className={row.status === "OVERDUE" ? "font-semibold text-red-300" : row.status === "RENTING" ? "text-blue-300" : "text-neutral-300"}>{statusLabel(row.status)}</TableCell>
                <TableCell>{row.modelName}</TableCell><TableCell className="font-mono text-sm">{row.serial}</TableCell>
                <TableCell><div>{row.username}</div><div className="text-xs text-neutral-500">{row.studentId}</div></TableCell>
                <TableCell>{row.specialRental ? <span className="border border-white/20 px-2 py-1 text-xs">특별 대여</span> : row.semester}</TableCell>
                <TableCell className="text-sm text-neutral-300">{formatDateTime(row.rentedAt)}</TableCell>
                <TableCell className="text-sm text-neutral-300">{row.returnedAt ? formatDateTime(row.returnedAt) : "대여 중"}</TableCell>
                <TableCell><button type="button" onClick={() => setSelected(row)} className="border border-neutral-500 px-3 py-1 text-xs hover:bg-neutral-800">상세 조회</button></TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>

      {selected && <section className="mt-5 border border-white/10 bg-[#0d1117] p-6">
        <div className="flex items-start justify-between"><div><p className="text-xs tracking-[0.15em] text-neutral-500">RENTAL DETAIL</p><h2 className="mt-1 text-xl font-semibold">{selected.modelName} · {selected.serial}</h2></div><button onClick={() => setSelected(null)} className="text-sm text-neutral-400 hover:text-white">닫기</button></div>
        <div className="mt-6 grid gap-x-10 gap-y-5 text-sm md:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-neutral-500">대여자</p><p className="mt-1">{selected.username} ({selected.studentId})</p><p className="text-xs text-neutral-500">{selected.email}</p></div>
          <div><p className="text-neutral-500">대여 구분</p><p className="mt-1">{selected.specialRental ? "특별 대여" : selected.semester}</p></div>
          <div><p className="text-neutral-500">대여 / 반납</p><p className="mt-1">{formatDateTime(selected.rentedAt)}</p><p className="text-xs text-neutral-500">{selected.returnedAt ? formatDateTime(selected.returnedAt) : "현재 대여 중"}</p></div>
          <div><p className="text-neutral-500">총 점유 기간</p><p className="mt-1 text-lg font-semibold">{formatDuration(selected.occupiedMinutes)}</p><p className="text-xs text-neutral-500">24시간 기준 {selected.occupiedDays}일</p></div>
          {selected.specialRental && <div className="md:col-span-2 lg:col-span-4"><p className="text-neutral-500">특별 대여 사유 / 승인자</p><p className="mt-1">{selected.specialReason || "-"} · {selected.specialApprovedBy || "-"}</p></div>}
        </div>
      </section>}

      {(data?.totalPages ?? 0) > 1 && <div className="mt-6 flex justify-center gap-2">
        <button disabled={page === 0} onClick={() => { setPage(page - 1); setSelected(null); }} className="border border-neutral-700 px-3 py-1 text-sm disabled:opacity-40">이전</button>
        {pages.slice(Math.max(0, page - 2), Math.min(pages.length, page + 3)).map((number) => <button key={number} onClick={() => { setPage(number); setSelected(null); }} className={`h-8 w-8 border text-sm ${number === page ? "border-white bg-white text-black" : "border-neutral-700"}`}>{number + 1}</button>)}
        <button disabled={page + 1 >= (data?.totalPages ?? 0)} onClick={() => { setPage(page + 1); setSelected(null); }} className="border border-neutral-700 px-3 py-1 text-sm disabled:opacity-40">다음</button>
      </div>}
    </div>
  );
};

export default RentalHistory;
