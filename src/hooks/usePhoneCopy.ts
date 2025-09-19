import { toast } from "sonner";

export function usePhoneCopy() {
  return async (text: string) => {
    if (!text) {
      toast("복사할 연락처가 없습니다.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast(`연락처가 복사되었습니다: ${text}`);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast(`연락처가 복사되었습니다: ${text}`);
    }
  };
}
