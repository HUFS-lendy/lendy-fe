import { useMemo, useState } from "react";
import { Laptop, Tablet, ChevronLeft, ChevronRight } from "lucide-react";
import { useModels } from "../api/model.api";
import type { ModelItem } from "../type/model.type";
import { getEquipmentInfo, parseSpecifications } from "../lib/equipmentInfo";

type FilterKey = "ALL" | "IPAD" | "GALAXY_TAB" | "GALAXY_BOOK" | "LENOVO";
const filters: Array<{ key: FilterKey; label: string }> = [
  { key: "ALL", label: "전체" },
  { key: "IPAD", label: "아이패드" },
  { key: "GALAXY_TAB", label: "갤럭시 탭" },
  { key: "GALAXY_BOOK", label: "갤럭시 북" },
  { key: "LENOVO", label: "레노버 노트북" },
];

const classify = (item: ModelItem): Exclude<FilterKey, "ALL"> => {
  const value = `${item.name} ${item.displayName} ${item.subName}`.toLowerCase();
  if (value.includes("ipad") || value.includes("air 2") || value.includes("air 3")) return "IPAD";
  if (value.includes("s3 9.7") || value.includes("s8") || value.includes("galaxy tab")) return "GALAXY_TAB";
  if (value.includes("thinkpad") || value.includes("s440") || value.includes("e460") || value.includes("레노버")) return "LENOVO";
  return "GALAXY_BOOK";
};

const performanceRank = (item: ModelItem) => {
  const value = `${item.name} ${item.displayName} ${item.subName}`.toLowerCase();
  if (value.includes("nt961xfg") || value.includes("16형") || value.includes("book3")) return 100;
  if (value.includes("nt951xed") || value.includes("i5형") || value.includes("book2")) return 90;
  if (value.includes("s8")) return 80;
  if (value.includes("air 3")) return 70;
  if (value.includes("s3 9.7")) return 60;
  if (value.includes("air 2")) return 50;
  if (value.includes("e460")) return 40;
  if (value.includes("s440")) return 30;
  return 0;
};

const EquipmentCard = ({ item }: { item: ModelItem }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const info = getEquipmentInfo(item);
  const specs = parseSpecifications(info.specifications);
  const isTablet = `${item.categoryName} ${info.title}`.toLowerCase().includes("tab") || info.title.toLowerCase().includes("ipad");
  const move = (offset: number) => setImageIndex((current) => (current + offset + info.imageUrls.length) % info.imageUrls.length);

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#0c1115] transition-transform duration-200 hover:-translate-y-1">
      <div className="relative flex h-56 items-center justify-center bg-[#f5f6f7] p-7">
        {info.imageUrls.length ? (
          <img src={info.imageUrls[imageIndex]} alt={`${info.title} 제품 이미지 ${imageIndex + 1}`} className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-4 text-neutral-400">
            {isTablet ? <Tablet size={74} strokeWidth={1.1} /> : <Laptop size={88} strokeWidth={1.1} />}
            <span className="text-sm tracking-[0.18em]">PRODUCT IMAGE</span>
          </div>
        )}
        {info.imageUrls.length > 1 && <>
          <button aria-label="이전 이미지" onClick={() => move(-1)} className="absolute left-4 rounded-full bg-black/60 p-2 text-white"><ChevronLeft /></button>
          <button aria-label="다음 이미지" onClick={() => move(1)} className="absolute right-4 rounded-full bg-black/60 p-2 text-white"><ChevronRight /></button>
        </>}
        <span className="absolute left-5 top-5 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">{item.infoBadgeLabel?.trim() || item.categoryName}</span>
      </div>
      {info.imageUrls.length > 1 && <div className="flex justify-center gap-2 bg-[#f5f6f7] pb-5">{info.imageUrls.map((_, index) => <button key={index} aria-label={`${index + 1}번 이미지`} onClick={() => setImageIndex(index)} className={`h-2 rounded-full transition-all ${index === imageIndex ? "w-6 bg-black" : "w-2 bg-neutral-300"}`} />)}</div>}
      <div className="p-6">
        <p className="text-sm text-neutral-500">{info.model}</p>
        <h2 className="mt-1 text-xl font-bold text-white">{info.title}</h2>
        <p className="mt-3 min-h-10 break-keep text-sm leading-6 text-neutral-300">{info.summary}</p>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-neutral-800 py-4">
          {specs.slice(0, 6).map((spec, index) => <div key={`${spec.label}-${index}`}><p className="text-xs text-neutral-500">{spec.label}</p><p className="mt-1 text-sm font-medium text-neutral-100">{spec.value}</p></div>)}
        </div>
        {info.pending && <p className="mt-4 text-xs text-neutral-500">상세 정보 준비 중</p>}
      </div>
    </article>
  );
};

const EquipmentGuide = () => {
  const { data: models = [], isLoading } = useModels();
  const [filter, setFilter] = useState<FilterKey>("ALL");
  const equipment = useMemo(() => models
    .filter((item) => item.type === "EQUIPMENT" && item.visibleToUsers)
    .filter((item) => filter === "ALL" || classify(item) === filter)
    .sort((a, b) => performanceRank(b) - performanceRank(a)), [models, filter]);
  return <main className="min-h-screen bg-[#060a0c] px-6 pb-28 pt-36 text-white">
    <div className="mx-auto max-w-7xl">
      <p className="text-sm tracking-[0.25em] text-neutral-500">EQUIPMENT GUIDE</p>
      <h1 className="mt-4 text-4xl font-bold md:text-5xl">기자재 모델 안내</h1>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="기자재 분류 필터">
        {filters.map((item) => <button key={item.key} type="button" onClick={() => setFilter(item.key)} className={`rounded-full border px-5 py-2 text-sm transition-colors ${filter === item.key ? "border-white bg-white font-semibold text-black" : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white"}`}>{item.label}</button>)}
      </div>
      {isLoading ? <p className="mt-16 text-neutral-400">기자재 정보를 불러오는 중입니다.</p> : equipment.length ? <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{equipment.map((item) => <EquipmentCard key={item.modelId} item={item} />)}</div> : <div className="mt-10 rounded-2xl border border-neutral-800 py-20 text-center text-neutral-500">해당 분류에 등록된 기자재가 없습니다.</div>}
    </div>
  </main>;
};

export default EquipmentGuide;
