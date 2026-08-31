import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { useKitCourseOffering, useKitInventory } from "../../../api/admin.kitCourseOffering.api";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import { Input } from "../../../components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table";

const statusLabel = (assignmentStatus: string | null, itemState: string) => {
  if (itemState === "BREAKDOWN") return "고장";
  if (itemState === "LOST") return "분실";
  if (assignmentStatus === "RENTED") return "대여 중";
  if (assignmentStatus === "RETURNED") return "반납 완료";
  return "대여 이력 없음";
};
const statusClass = (assignmentStatus: string | null, itemState: string) => {
  if (itemState === "BREAKDOWN") return "text-orange-300";
  if (itemState === "LOST") return "text-red-300";
  if (assignmentStatus === "RENTED") return "text-blue-300";
  if (assignmentStatus === "RETURNED") return "text-green-300";
  return "text-neutral-400";
};
const formatDate = (value: string | null) => value ? new Date(value).toLocaleString("ko-KR") : "-";

const KitInventory = () => {
  const { modelId, offeringId } = useParams();
  const parsedOfferingId = Number(offeringId);
  const [keyword, setKeyword] = useState("");
  const offeringQuery = useKitCourseOffering(parsedOfferingId);
  const inventoryQuery = useKitInventory(parsedOfferingId);
  const rows = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return (inventoryQuery.data ?? []).filter((item) =>
      !normalized || [item.serial, item.username, item.studentId]
        .some((value) => value?.toLowerCase().includes(normalized)));
  }, [inventoryQuery.data, keyword]);
  const counts = useMemo(() => ({
    total: inventoryQuery.data?.length ?? 0,
    rented: inventoryQuery.data?.filter((item) => item.assignmentStatus === "RENTED").length ?? 0,
    returned: inventoryQuery.data?.filter((item) => item.assignmentStatus === "RETURNED").length ?? 0,
    noRental: inventoryQuery.data?.filter((item) =>
      item.assignmentStatus !== "RENTED" && item.assignmentStatus !== "RETURNED").length ?? 0,
  }), [inventoryQuery.data]);

  return (
    <div className="min-h-full w-full bg-[#060a0c] px-8 pb-16 text-white">
      <div className="pt-14">
        <Breadcrumb><BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink className="text-white" href="/admin">홈</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink className="text-white" href="/admin/kits">실습키트 현황</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink className="text-white" href={`/admin/kits/${modelId}`}>{offeringQuery.data?.modelName || "학기별 운영"}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage className="text-white">{offeringQuery.data?.academicTermCode || "키트 목록"}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList></Breadcrumb>
      </div>
      <div className="pt-8">
        <h1 className="text-3xl font-bold">{offeringQuery.data?.academicTermCode || ""} 운영 현황</h1>
        <p className="mt-2 text-sm text-neutral-400">
          {offeringQuery.data ? `${offeringQuery.data.courseName} · ${offeringQuery.data.modelName} · 담당 ${offeringQuery.data.assistantUsername}` : "운영 정보를 불러오는 중입니다."}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Summary label="전체 키트" value={counts.total} />
          <Summary label="대여 중" value={counts.rented} color="text-blue-300" />
          <Summary label="반납 완료" value={counts.returned} color="text-green-300" />
          <Summary label="대여 이력 없음" value={counts.noRental} color="text-neutral-300" />
        </div>
        <div className="mb-4 mt-6 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input value={keyword} onChange={(event) => setKeyword(event.target.value)}
              placeholder="키트 번호, 이름 또는 학번 검색" className="border-neutral-700 bg-[#080c10] pl-9" />
          </div>
          <p className="shrink-0 text-sm text-neutral-400">검색 결과 {rows.length}개</p>
        </div>
        <div className="overflow-x-auto border border-neutral-700">
          <Table className="min-w-[1100px] text-center">
            <TableHeader className="bg-[#11141b]">
              <TableRow className="border-neutral-700 hover:bg-[#11141b]">
                <Head>키트 번호</Head><Head>운영 상태</Head><Head>최종 대여자</Head><Head>학번</Head>
                <Head>이메일</Head><Head>대여일</Head><Head>반납 여부</Head><Head>반납일</Head>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryQuery.isLoading ? <Empty text="키트 목록을 불러오는 중입니다." />
                : inventoryQuery.isError ? <Empty text="키트 운영 현황을 불러오지 못했습니다." error />
                : rows.length === 0 ? <Empty text="조건에 맞는 키트가 없습니다." />
                : rows.map((item) => (
                  <TableRow key={item.itemId} className="border-neutral-800">
                    <TableCell className="font-mono font-semibold">{item.serial}</TableCell>
                    <TableCell className={statusClass(item.assignmentStatus, item.itemState)}>
                      {statusLabel(item.assignmentStatus, item.itemState)}
                    </TableCell>
                    <TableCell>{item.username || "-"}</TableCell>
                    <TableCell>{item.studentId || "-"}</TableCell>
                    <TableCell className="text-neutral-400">{item.email || "-"}</TableCell>
                    <TableCell className="text-neutral-400">{formatDate(item.rentedAt)}</TableCell>
                    <TableCell className={item.returnedAt ? "text-green-300" : item.rentedAt ? "text-blue-300" : "text-neutral-400"}>
                      {item.returnedAt ? "반납 완료" : item.rentedAt ? "미반납" : "-"}
                    </TableCell>
                    <TableCell className={item.returnedAt ? "text-green-300" : "text-neutral-400"}>{formatDate(item.returnedAt)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

const Head = ({ children }: { children: React.ReactNode }) => <TableHead className="text-center text-white">{children}</TableHead>;
const Empty = ({ text, error = false }: { text: string; error?: boolean }) => (
  <TableRow><TableCell colSpan={8} className={`py-16 text-center ${error ? "text-red-300" : "text-neutral-400"}`}>{text}</TableCell></TableRow>
);
const Summary = ({ label, value, color = "" }: { label: string; value: number; color?: string }) => (
  <div className="border border-neutral-700 bg-[#0d1117] p-4 text-center">
    <p className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</p>
    <p className="mt-1 text-xs text-neutral-500">{label}</p>
  </div>
);

export default KitInventory;
