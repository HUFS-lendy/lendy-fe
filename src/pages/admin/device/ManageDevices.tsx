import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Save, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { uploadModelInfoImage, useModels, useUpdateModelInfo } from "../../../api/adminModel.api";
import type { ModelItem } from "../../../type/adminModel.type";
import { getEquipmentInfo } from "../../../lib/equipmentInfo";

type FormState = { infoVisible: boolean; rentalGroupKey: string; infoBadgeLabel: string; infoSummary: string; recommendedFor: string; specifications: string; referenceUrl: string; imageUrls: string[] };
const infoFor = (model: ModelItem) => getEquipmentInfo({ name: model.name, displayName: model.displayName || "", subName: model.subName || "", description: model.description || "", infoSummary: model.infoSummary, recommendedFor: model.recommendedFor, specifications: model.specifications, referenceUrl: model.referenceUrl, imageUrls: model.imageUrls });

const ManageDevices = () => {
  const { data: models = [], isLoading } = useModels();
  const equipment = useMemo(() => models.filter((model) => model.type === "EQUIPMENT"), [models]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({ infoVisible: true, rentalGroupKey: "", infoBadgeLabel: "", infoSummary: "", recommendedFor: "", specifications: "", referenceUrl: "", imageUrls: [] });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const updateInfo = useUpdateModelInfo();
  const selected = equipment.find((model) => model.modelId === selectedId) || null;
  useEffect(() => { if (!selectedId && equipment[0]) setSelectedId(equipment[0].modelId); }, [equipment, selectedId]);
  useEffect(() => { if (selected) { const info = infoFor(selected); setForm({ infoVisible: selected.infoVisible !== false, rentalGroupKey: selected.rentalGroupKey || "", infoBadgeLabel: selected.infoBadgeLabel || selected.categoryName, infoSummary: info.summary, recommendedFor: info.recommendedFor, specifications: info.specifications, referenceUrl: info.referenceUrl, imageUrls: info.imageUrls }); } }, [selected]);
  const patch = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const moveImage = (index: number, offset: number) => { const next = [...form.imageUrls]; const target = index + offset; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; patch("imageUrls", next); };
  const upload = async (files: FileList | null) => { if (!files?.length) return; if (form.imageUrls.length + files.length > 8) { toast.error("이미지는 모델당 최대 8장까지 등록할 수 있습니다."); return; } setUploading(true); try { const urls = await Promise.all(Array.from(files).map(uploadModelInfoImage)); patch("imageUrls", [...form.imageUrls, ...urls]); } catch { toast.error("이미지 업로드에 실패했습니다."); } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; } };
  const save = () => { if (!selected) return; updateInfo.mutate({ modelId: selected.modelId, ...form }, { onSuccess: () => toast.success("모델 안내 정보를 저장했습니다."), onError: () => toast.error("저장에 실패했습니다.") }); };

  return <div className="min-h-screen bg-[#060a0c] px-8 py-16 text-white"><div className="mx-auto max-w-7xl">
    <p className="text-sm tracking-[0.2em] text-neutral-500">EQUIPMENT CONTENT</p>
    <div className="mt-3 flex items-end justify-between"><div><h1 className="text-3xl font-bold">기자재 안내 관리</h1><p className="mt-3 text-neutral-400">학생에게 표시할 모델별 설명과 이미지를 관리합니다.</p></div><a href="/equipment-guide" target="_blank" className="rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800">학생 화면 보기</a></div>
    <div className="mt-10 grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-2xl border border-neutral-800 bg-[#0c1115] p-3"><p className="px-3 py-3 text-xs font-semibold tracking-wider text-neutral-500">등록 모델 {equipment.length}</p>{isLoading ? <p className="p-3 text-sm text-neutral-500">불러오는 중...</p> : equipment.map((model) => { const info = infoFor(model); return <button key={model.modelId} onClick={() => setSelectedId(model.modelId)} className={`mb-1 w-full rounded-xl px-4 py-3 text-left ${selectedId === model.modelId ? "bg-white text-black" : "hover:bg-neutral-900"}`}><div className="flex items-center justify-between gap-3"><p className="truncate font-semibold">{info.title}</p>{model.infoVisible === false && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${selectedId === model.modelId ? "bg-neutral-200 text-neutral-600" : "bg-neutral-800 text-neutral-400"}`}>숨김</span>}</div><p className={`mt-1 text-xs ${selectedId === model.modelId ? "text-neutral-600" : "text-neutral-500"}`}>{info.model || model.name}</p></button>; })}</aside>
      {selected && <section className="rounded-2xl border border-neutral-800 bg-[#0c1115] p-7"><div className="border-b border-neutral-800 pb-6"><p className="text-sm text-neutral-500">선택 모델</p><h2 className="mt-1 text-2xl font-bold">{infoFor(selected).title}</h2></div>
        <div className="mt-7 grid gap-6">
          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-700 bg-[#080c0f] px-4 py-4"><span><span className="block text-sm font-semibold">모델 안내 페이지에 표시</span><span className="mt-1 block text-xs text-neutral-500">예약 목록 노출 여부에는 영향을 주지 않습니다.</span></span><input type="checkbox" checked={form.infoVisible} onChange={(e) => patch("infoVisible", e.target.checked)} className="h-5 w-5 accent-white" /></label>
          <label className="grid gap-2 text-sm">표시 모델군 코드 <span className="text-xs text-neutral-500">같은 제품으로 합칠 내부 모델에 동일한 코드를 입력합니다. 예: THINKPAD_E460</span><input value={form.rentalGroupKey} onChange={(e) => patch("rentalGroupKey", e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))} maxLength={100} placeholder="예: THINKPAD_E460" className="rounded-xl border border-neutral-700 bg-[#080c0f] px-4 py-3 font-mono outline-none focus:border-neutral-400" /></label>
          <label className="grid gap-2 text-sm">카드 분류명 <span className="text-xs text-neutral-500">학생 화면의 제품 이미지 왼쪽 위에 표시됩니다.</span><input value={form.infoBadgeLabel} onChange={(e) => patch("infoBadgeLabel", e.target.value)} maxLength={100} placeholder="예: 갤럭시 북" className="rounded-xl border border-neutral-700 bg-[#080c0f] px-4 py-3 outline-none focus:border-neutral-400" /></label>
          <label className="grid gap-2 text-sm">한 줄 소개<textarea value={form.infoSummary} onChange={(e) => patch("infoSummary", e.target.value)} rows={3} maxLength={1000} className="rounded-xl border border-neutral-700 bg-[#080c0f] p-4 leading-6 outline-none focus:border-neutral-400" /></label>
          <label className="grid gap-2 text-sm">추천 용도<textarea value={form.recommendedFor} onChange={(e) => patch("recommendedFor", e.target.value)} rows={2} maxLength={500} className="rounded-xl border border-neutral-700 bg-[#080c0f] p-4 leading-6 outline-none focus:border-neutral-400" /></label>
          <label className="grid gap-2 text-sm">주요 사양 <span className="text-xs text-neutral-500">한 줄에 `항목:내용` 형식으로 입력해주세요.</span><textarea value={form.specifications} onChange={(e) => patch("specifications", e.target.value)} rows={7} maxLength={2000} className="rounded-xl border border-neutral-700 bg-[#080c0f] p-4 font-mono text-sm leading-7 outline-none focus:border-neutral-400" /></label>
          <label className="grid gap-2 text-sm">참고 링크<input value={form.referenceUrl} onChange={(e) => patch("referenceUrl", e.target.value)} maxLength={1000} placeholder="https://" className="rounded-xl border border-neutral-700 bg-[#080c0f] px-4 py-3 outline-none focus:border-neutral-400" /></label>
          <div><div className="flex items-center justify-between"><div><p className="text-sm">제품 이미지</p><p className="mt-1 text-xs text-neutral-500">첫 번째 이미지가 대표 이미지입니다. 최대 8장</p></div><button disabled={uploading} onClick={() => fileRef.current?.click()} className="flex items-center gap-2 rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800 disabled:opacity-50">{uploading ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />} 이미지 추가</button><input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} /></div>
            {form.imageUrls.length ? <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{form.imageUrls.map((url, index) => <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border border-neutral-800 bg-white"><img src={url} alt="" className="h-32 w-full object-contain" /><div className="flex justify-between bg-[#10161b] p-2"><span className="text-xs text-neutral-400">{index === 0 ? "대표" : `${index + 1}번`}</span><div className="flex gap-1"><button aria-label="앞으로" onClick={() => moveImage(index, -1)}><ArrowUp size={15} /></button><button aria-label="뒤로" onClick={() => moveImage(index, 1)}><ArrowDown size={15} /></button><button aria-label="삭제" onClick={() => patch("imageUrls", form.imageUrls.filter((_, i) => i !== index))} className="text-red-400"><Trash2 size={15} /></button></div></div></div>)}</div> : <div className="mt-4 rounded-xl border border-dashed border-neutral-700 p-8 text-center text-sm text-neutral-500">등록된 이미지가 없습니다. 학생 화면에는 임시 이미지가 표시됩니다.</div>}
          </div>
        </div><div className="mt-8 flex justify-end"><button onClick={save} disabled={updateInfo.isPending} className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-neutral-200 disabled:opacity-50"><Save size={17} />{updateInfo.isPending ? "저장 중..." : "저장"}</button></div>
      </section>}
    </div>
  </div></div>;
};
export default ManageDevices;
