import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bold, Heading1, Heading2, ImagePlus, Pilcrow, Underline } from "lucide-react";
import { toast } from "sonner";
import { uploadNoticeImage, useNotice, useSaveNotice } from "../../../api/notice.api";

const COLORS = ["#f5f5f5", "#a3a3a3", "#34d399", "#60a5fa", "#fbbf24", "#fb7185"];

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const legacyInlineToHtml = (value: string) => escapeHtml(value)
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/`([^`]+)`/g, "<code>$1</code>");

const legacyMarkdownToEditorHtml = (value: string) => {
  let inCodeBlock = false;
  return value.split(/\r?\n/).map((line) => {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      return "";
    }
    if (inCodeBlock) return `<pre>${escapeHtml(line)}</pre>`;
    if (!line) return "<p><br></p>";
    if (line.startsWith("### ")) return `<h3>${legacyInlineToHtml(line.slice(4))}</h3>`;
    if (line.startsWith("## ")) return `<h2>${legacyInlineToHtml(line.slice(3))}</h2>`;
    if (line.startsWith("# ")) return `<h2>${legacyInlineToHtml(line.slice(2))}</h2>`;
    if (line.startsWith("> ")) return `<blockquote>${legacyInlineToHtml(line.slice(2))}</blockquote>`;
    if (line.startsWith("- ")) return `<p>• ${legacyInlineToHtml(line.slice(2))}</p>`;
    const image = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
    if (image) return `<p><img src="${escapeHtml(image[2])}" alt="${escapeHtml(image[1])}" /></p>`;
    return `<p>${legacyInlineToHtml(line)}</p>`;
  }).join("");
};

export default function NoticeEditor() {
  const id = Number(useParams().noticeId);
  const editing = Number.isFinite(id);
  const { data } = useNotice(editing ? id : undefined);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [uploading, setUploading] = useState(false);
  const editor = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const save = useSaveNotice();

  useEffect(() => {
    if (!data) return;
    const editorContent = /^\s*</.test(data.content)
      ? data.content
      : legacyMarkdownToEditorHtml(data.content);
    setTitle(data.title);
    setContent(editorContent);
    setPinned(data.pinned);
    if (editor.current) editor.current.innerHTML = editorContent;
  }, [data]);

  const syncContent = () => setContent(editor.current?.innerHTML ?? "");
  const format = (command: string, value?: string) => {
    editor.current?.focus();
    document.execCommand(command, false, value);
    syncContent();
  };
  const formatBlock = (tag: "p" | "h2" | "h3") => format("formatBlock", tag);

  const image = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadNoticeImage(file);
      editor.current?.focus();
      document.execCommand("insertHTML", false, `<p><img src="${url}" alt="공지사항 첨부 이미지" /></p><p><br></p>`);
      syncContent();
      toast.success("이미지를 본문에 추가했습니다.");
    } catch {
      toast.error("이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  };

  const submit = () => {
    const text = editor.current?.innerText.trim() ?? "";
    const hasImage = Boolean(editor.current?.querySelector("img"));
    if (!title.trim() || (!text && !hasImage)) return toast.warning("제목과 본문을 입력해주세요.");
    save.mutate(
      { id: editing ? id : undefined, input: { title: title.trim(), content, pinned } },
      {
        onSuccess: () => {
          toast.success(editing ? "공지사항을 수정했습니다." : "공지사항을 게시했습니다.");
          nav("/admin/notices");
        },
        onError: () => toast.error("공지사항을 저장하지 못했습니다."),
      },
    );
  };

  const toolClass = "flex h-9 items-center gap-1.5 border border-white/15 px-3 text-sm text-neutral-300 hover:border-white/30 hover:bg-white/5";

  return (
    <div className="min-h-screen bg-[#060a0c] text-white">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#060a0c]/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button onClick={() => nav("/admin/notices")} className="text-sm text-neutral-400 hover:text-white">← 나가기</button>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} /> 중요 공지로 고정
            </label>
            <button disabled={save.isPending} onClick={submit} className="bg-emerald-500 px-5 py-2 text-sm font-bold text-black disabled:opacity-50">
              {save.isPending ? "저장 중..." : editing ? "수정 완료" : "게시하기"}
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="제목을 입력하세요" className="w-full border-none bg-transparent text-4xl font-bold leading-tight outline-none placeholder:text-neutral-700" />
        <div className="mt-8 border-t border-white/15" />

        <div className="sticky top-[73px] z-10 -mx-2 mt-6 flex flex-wrap items-center gap-2 border-y border-white/10 bg-[#060a0c]/95 px-2 py-3 backdrop-blur">
          <button type="button" className={toolClass} onClick={() => format("bold")}><Bold className="h-4 w-4" /> 굵게</button>
          <button type="button" className={toolClass} onClick={() => format("underline")} title="밑줄"><Underline className="h-4 w-4" /></button>
          <button type="button" className={toolClass} onClick={() => formatBlock("h2")}><Heading1 className="h-4 w-4" /> 큰 제목</button>
          <button type="button" className={toolClass} onClick={() => formatBlock("h3")}><Heading2 className="h-4 w-4" /> 작은 제목</button>
          <button type="button" className={toolClass} onClick={() => formatBlock("p")}><Pilcrow className="h-4 w-4" /> 본문</button>
          <div className="flex h-9 items-center gap-2 border border-white/15 px-3" title="글자색">
            <span className="text-xs text-neutral-500">색상</span>
            {COLORS.map((color) => <button key={color} type="button" aria-label={`글자색 ${color}`} onClick={() => format("foreColor", color)} className="h-4 w-4 rounded-full border border-white/30" style={{ backgroundColor: color }} />)}
          </div>
          <button disabled={uploading} type="button" onClick={() => input.current?.click()} className={toolClass}>
            <ImagePlus className="h-4 w-4" />{uploading ? "업로드 중..." : "이미지 첨부"}
          </button>
          <input ref={input} type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden onChange={(e) => void image(e.target.files?.[0])} />
        </div>

        <div
          ref={editor}
          contentEditable
          suppressContentEditableWarning
          onInput={syncContent}
          data-placeholder="공지사항 내용을 입력하세요."
          className="mt-8 min-h-[560px] break-words text-[16px] leading-8 text-neutral-200 outline-none empty:before:pointer-events-none empty:before:text-neutral-700 empty:before:content-[attr(data-placeholder)] [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-3 [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-bold [&_img]:my-8 [&_img]:max-h-[680px] [&_img]:max-w-full [&_img]:object-contain [&_p]:my-4"
        />
      </main>
    </div>
  );
}
