import type { ModelItem } from "../type/model.type";

export type EquipmentInfo = {
  title: string;
  model: string;
  summary: string;
  recommendedFor: string;
  specifications: string;
  referenceUrl: string;
  imageUrls: string[];
  pending?: boolean;
};

const presets: Array<{ matches: string[]; info: Omit<EquipmentInfo, "imageUrls"> }> = [
  {
    matches: ["s3 9.7", "galaxy tab s3"],
    info: {
      title: "Galaxy Tab S3 9.7",
      model: "SM-T820 계열",
      summary: "강의 자료 열람과 필기에 사용할 수 있는 9.7형 태블릿입니다.",
      recommendedFor: "강의 필기, 문서 열람, 가벼운 웹 작업",
      specifications: "화면:9.7형 AMOLED\n메모리:4GB / 32GB\n무게:약 429g\n펜:S Pen 포함\n배터리:6,000mAh",
      referenceUrl: "https://prod.danawa.com/info/?pcode=4868466",
    },
  },
  {
    matches: ["s8", "galaxy tab s8"],
    info: {
      title: "Galaxy Tab S8",
      model: "128GB Wi-Fi",
      summary: "강의 필기와 문서 작업에 사용할 수 있는 11형 태블릿입니다.",
      recommendedFor: "강의 필기, PDF 주석, 온라인 수업, 멀티태스킹",
      specifications: "화면:11형 TFT · 120Hz\n메모리:8GB / 128GB\n무게:약 503g\n펜:S Pen 포함\n배터리:8,000mAh",
      referenceUrl: "https://prod.danawa.com/info/?pcode=16246217",
    },
  },
  {
    matches: ["nt951xed", "i5형", "book2 pro"],
    info: {
      title: "갤럭시 북 2 Pro",
      model: "NT951XED 계열",
      summary: "수업과 일반적인 개발 작업에 사용할 수 있는 15.6형 노트북입니다.",
      recommendedFor: "문서 작성, 프로그래밍 수업, 일반 개발 환경",
      specifications: "화면:15.6형\n프로세서:Intel Core i5 계열\n운영체제:Windows\n용도:학업 · 프로그래밍 · 문서 작업",
      referenceUrl: "https://sinsungcns.com/goods/view?no=2079",
    },
  },
  {
    matches: ["nt961xfg", "16형", "book3 pro"],
    info: {
      title: "갤럭시 북 3 Pro",
      model: "NT961XFG-K0B/C",
      summary: "프로그래밍과 다중 작업에 사용할 수 있는 16형 노트북입니다.",
      recommendedFor: "프로그래밍, 팀 프로젝트, 멀티태스킹, 큰 화면이 필요한 작업",
      specifications: "화면:16형 AMOLED\n프로세서:Intel Core i7 계열\n운영체제:Windows\n용도:개발 · 프로젝트 · 멀티태스킹",
      referenceUrl: "https://ubro.net/product/nt961xfg-k0bc-%EA%B0%A4%EB%9F%AD%EC%8B%9C%EB%B6%813-%ED%94%84%EB%A1%9C-16%ED%98%95/2233/",
    },
  },
  {
    matches: ["air 2", "ipad air 2"],
    info: {
      title: "iPad Air 2",
      model: "16GB Wi-Fi",
      summary: "강의 자료 열람과 기본 학습에 사용할 수 있는 9.7형 태블릿입니다.",
      recommendedFor: "강의 자료 열람, 웹 검색, 영상 시청",
      specifications: "화면:9.7형 Retina\n저장공간:16GB\n무게:약 437g\n펜:미포함",
      referenceUrl: "https://support.apple.com/ko-kr/112017",
    },
  },
  {
    matches: ["air 3", "ipad air 3"],
    info: {
      title: "iPad Air 3",
      model: "64GB Wi-Fi",
      summary: "강의 자료 열람과 문서 작업에 사용할 수 있는 10.5형 태블릿입니다.",
      recommendedFor: "강의 자료 열람, 문서 작업, 콘텐츠 시청",
      specifications: "화면:10.5형 Retina\n칩:A12 Bionic\n저장공간:64GB\n무게:약 456g\n펜:미포함",
      referenceUrl: "https://support.apple.com/ko-kr/111939",
    },
  },
];

export const getEquipmentInfo = (item: Pick<ModelItem, "name" | "displayName" | "subName" | "description" | "studentDisplayName" | "infoSummary" | "recommendedFor" | "specifications" | "referenceUrl" | "imageUrls">): EquipmentInfo => {
  const haystack = [item.name, item.displayName, item.subName].filter(Boolean).join(" ").toLowerCase();
  const preset = presets.find(({ matches }) => matches.some((value) => haystack.includes(value.toLowerCase())))?.info;
  const thinkPad = haystack.includes("thinkpad") || haystack.includes("s440") || haystack.includes("e460");
  const fallback: Omit<EquipmentInfo, "imageUrls"> = thinkPad
    ? { title: item.displayName || "ThinkPad", model: item.subName || item.name, summary: "상세 정보를 준비하고 있습니다.", recommendedFor: "정보 준비 중", specifications: "상세 사양:정보 준비 중", referenceUrl: "", pending: true }
    : { title: item.displayName || item.name, model: item.subName || "", summary: item.description || "기자재 상세 정보를 준비하고 있습니다.", recommendedFor: "정보 준비 중", specifications: "상세 사양:정보 준비 중", referenceUrl: "", pending: true };
  const base = preset || fallback;
  return {
    ...base,
    title: item.studentDisplayName?.trim() || base.title,
    summary: item.infoSummary || base.summary,
    recommendedFor: item.recommendedFor || base.recommendedFor,
    specifications: item.specifications || base.specifications,
    referenceUrl: item.referenceUrl || base.referenceUrl,
    imageUrls: item.imageUrls || [],
    pending: !item.infoSummary && base.pending,
  };
};

export const parseSpecifications = (value: string) => value.split("\n").filter(Boolean).map((line) => {
  const index = line.indexOf(":");
  return index < 0 ? { label: "사양", value: line } : { label: line.slice(0, index).trim(), value: line.slice(index + 1).trim() };
});

export const mergeRentalGroupModels = (models: ModelItem[]): ModelItem[] => {
  const grouped = new Map<string, ModelItem[]>();
  const standalone: ModelItem[] = [];
  models.forEach((model) => {
    const key = model.rentalGroupKey?.trim();
    if (!key) { standalone.push(model); return; }
    grouped.set(key, [...(grouped.get(key) || []), model]);
  });
  const merged = Array.from(grouped.values()).map((members) => {
    const representative = members.find((model) => model.infoVisible !== false) || members[0];
    return { ...representative, availableQty: members.reduce((sum, model) => sum + model.availableQty, 0) };
  });
  return [...standalone, ...merged];
};
