import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useModels } from "../../../api/adminModel.api";
import { useKitCourseOfferings } from "../../../api/admin.kitCourseOffering.api";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../components/ui/table";
import type { ModelItem } from "../../../type/adminModel.type";

const Kit = () => {
  const navigate = useNavigate();
  const { modelId } = useParams();
  const parsedModelId = Number(modelId);
  const modelsQuery = useModels();
  const offeringsQuery = useKitCourseOfferings();
  const model = ((modelsQuery.data ?? []) as ModelItem[])
    .find((item) => item.modelId === parsedModelId);
  const offerings = useMemo(
    () => (offeringsQuery.data ?? [])
      .filter((offering) => offering.modelId === parsedModelId)
      .sort((a, b) => b.academicTermCode.localeCompare(a.academicTermCode)),
    [offeringsQuery.data, parsedModelId],
  );

  const openOffering = (id: number) =>
    navigate(`/admin/kits/${parsedModelId}/offerings/${id}`);

  return (
    <div className="min-h-full w-full bg-[#060a0c] px-8 pb-16 text-white">
      <div className="pt-14">
        <Breadcrumb><BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink className="text-white" href="/admin">홈</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink className="text-white" href="/admin/kits">실습키트 현황</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage className="text-white">{model?.displayName || model?.name || "운영 현황"}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList></Breadcrumb>
      </div>
      <div className="pt-8">
        <h1 className="text-3xl font-bold">{model?.displayName || model?.name || "실습키트 운영 현황"}</h1>
        <p className="mt-2 text-sm text-neutral-400">
          학기별 운영을 선택해 전체 키트의 최종 대여자와 반납 여부를 확인합니다.
        </p>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-xl">
          <Summary label="전체 키트" value={model?.totalQty ?? 0} />
          <Summary label="대여 가능" value={model?.availableQty ?? 0} color="text-green-300" />
          <Summary label="대여 중" value={model?.rentedQty ?? 0} color="text-blue-300" />
        </div>
        <div className="mt-6 overflow-hidden border border-neutral-700">
          <Table className="text-center">
            <TableHeader className="bg-[#11141b]">
              <TableRow className="border-neutral-700 hover:bg-[#11141b]">
                <Head>운영 학기</Head><Head>수업명</Head><Head>담당 조교</Head>
                <Head>운영 상태</Head><Head>등록일</Head><TableHead className="w-14" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {offeringsQuery.isLoading || modelsQuery.isLoading
                ? <Empty text="학기별 운영 정보를 불러오는 중입니다." />
                : offeringsQuery.isError || modelsQuery.isError
                  ? <Empty text="운영 정보를 불러오지 못했습니다." error />
                  : offerings.length === 0
                    ? <Empty text="등록된 학기별 운영 정보가 없습니다. 먼저 강의 운영 작업을 생성해주세요." />
                    : offerings.map((offering) => (
                      <TableRow key={offering.kitCourseOfferingId} role="button" tabIndex={0}
                        onClick={() => openOffering(offering.kitCourseOfferingId)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") openOffering(offering.kitCourseOfferingId);
                        }}
                        className="cursor-pointer border-neutral-800 hover:bg-white/[0.04]">
                        <TableCell className="font-semibold">{offering.academicTermCode}</TableCell>
                        <TableCell>{offering.courseName}</TableCell>
                        <TableCell>{offering.assistantUsername}</TableCell>
                        <TableCell className={offering.active ? "text-green-300" : "text-neutral-500"}>
                          {offering.active ? "운영 중" : "운영 종료"}
                        </TableCell>
                        <TableCell className="text-neutral-400">{new Date(offering.createdAt).toLocaleDateString("ko-KR")}</TableCell>
                        <TableCell><ChevronRight className="h-4 w-4 text-neutral-500" /></TableCell>
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
  <TableRow><TableCell colSpan={6} className={`py-16 text-center ${error ? "text-red-300" : "text-neutral-400"}`}>{text}</TableCell></TableRow>
);
const Summary = ({ label, value, color = "" }: { label: string; value: number; color?: string }) => (
  <div className="border border-neutral-700 bg-[#0d1117] p-4 text-center">
    <p className={`text-2xl font-semibold tabular-nums ${color}`}>{value}</p>
    <p className="mt-1 text-xs text-neutral-500">{label}</p>
  </div>
);

export default Kit;
