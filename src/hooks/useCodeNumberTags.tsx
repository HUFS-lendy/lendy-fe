import { useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { X } from "lucide-react";

const CodeNumberTags: React.FC<{
  value: string[];
  onChange: (next: string[]) => void;
}> = ({ value, onChange }) => {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false); // ✅ IME 조합 플래그

  const add = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    if (!value.includes(v)) onChange([...value, v]); // 중복 방지
  };

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    // 한글/일본어 등 IME 조합 중이면 무시

    const composing =
      isComposing || e.nativeEvent.isComposing || e.keyCode === 229;
    if (composing) return;

    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
      setInput("");
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.clipboardData.getData("text");
    const parts = text
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) {
      e.preventDefault();
      const merged = [...value];
      parts.forEach((p) => {
        if (!merged.includes(p)) merged.push(p);
      });
      onChange(merged);
      setInput("");
    }
  };

  return (
    <div>
      <Label className="pb-2">키트 번호</Label>

      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onCompositionStart={() => setIsComposing(true)} // ✅ 시작
        onCompositionEnd={() => setIsComposing(false)} // ✅ 종료
        placeholder="시리얼 입력 후 Enter"
        className="text-foreground dark:text-white text-sm"
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-neutral-200 text-neutral-900 px-3 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="ml-1 hover:opacity-100 opacity-70"
              aria-label={`${tag} 제거`}
            >
              <X size={14} className="cursor-pointer" />
            </button>
          </span>
        ))}
      </div>

      <p className="text-xs text-neutral-400 mt-1">Enter/쉼표로 추가</p>
    </div>
  );
};

export default CodeNumberTags;
