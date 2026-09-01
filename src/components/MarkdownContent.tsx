import type { ReactNode } from "react";

const ALLOWED_TAGS = new Set(["P", "BR", "STRONG", "B", "U", "EM", "I", "H1", "H2", "H3", "UL", "OL", "LI", "BLOCKQUOTE", "A", "IMG", "CODE", "PRE", "SPAN", "FONT", "DIV"]);
const safeUrl = (value: string, image = false) => {
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:"].includes(url.protocol) || (image && url.protocol === "data:");
  } catch { return false; }
};
const sanitize = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  for (const element of Array.from(doc.body.querySelectorAll("*"))) {
    if (!ALLOWED_TAGS.has(element.tagName)) { element.replaceWith(...Array.from(element.childNodes)); continue; }
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const allowed = (element.tagName === "A" && name === "href") || (element.tagName === "IMG" && ["src", "alt"].includes(name)) || (element.tagName === "FONT" && name === "color");
      if (!allowed) element.removeAttribute(attribute.name);
    }
    if (element.tagName === "A") {
      const href = element.getAttribute("href") ?? "";
      if (!safeUrl(href)) element.removeAttribute("href");
      else { element.setAttribute("target", "_blank"); element.setAttribute("rel", "noreferrer"); }
    }
    if (element.tagName === "IMG" && !safeUrl(element.getAttribute("src") ?? "", true)) element.remove();
  }
  return doc.body.innerHTML;
};

const inline = (text: string): ReactNode[] => {
  const regex = /(!?\[[^\]]*\]\([^\s)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g; const out: ReactNode[] = []; let last = 0;
  for (const match of text.matchAll(regex)) { if (match.index! > last) out.push(text.slice(last, match.index)); const token = match[0];
    if (token.startsWith("![")) { const m = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/); if (m) out.push(<img key={match.index} src={m[2]} alt={m[1]} />); }
    else if (token.startsWith("[")) { const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/); if (m) out.push(<a key={match.index} href={m[2]} target="_blank" rel="noreferrer">{m[1]}</a>); }
    else if (token.startsWith("`")) out.push(<code key={match.index}>{token.slice(1, -1)}</code>);
    else out.push(<strong key={match.index}>{token.slice(2, -2)}</strong>); last = match.index! + token.length;
  } if (last < text.length) out.push(text.slice(last)); return out;
};

export default function MarkdownContent({ content }: { content: string }) {
  const isHtml = /^\s*</.test(content);
  const articleClass = "break-words text-[16px] leading-8 text-neutral-200 [&_a]:text-emerald-400 [&_a]:underline [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-500/5 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_img]:my-8 [&_img]:max-h-[680px] [&_img]:max-w-full [&_img]:object-contain [&_li]:ml-6 [&_ol]:list-decimal [&_p]:my-4 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:bg-black/40 [&_pre]:p-5 [&_ul]:list-disc";
  if (isHtml) return <article className={articleClass} dangerouslySetInnerHTML={{ __html: sanitize(content) }} />;
  let code = false; const lines = content.split("\n");
  return <article className={`${articleClass} space-y-4`}>{lines.map((line, i) => {
    if (line.startsWith("```")) { code = !code; return null; } if (code) return <pre key={i}>{line}</pre>;
    if (line.startsWith("### ")) return <h3 key={i}>{inline(line.slice(4))}</h3>;
    if (line.startsWith("## ")) return <h2 key={i}>{inline(line.slice(3))}</h2>;
    if (line.startsWith("# ")) return <h1 key={i}>{inline(line.slice(2))}</h1>;
    if (line.startsWith("- ")) return <div key={i} className="flex gap-3 pl-2"><span>•</span><p>{inline(line.slice(2))}</p></div>;
    if (line.startsWith("> ")) return <blockquote key={i}>{inline(line.slice(2))}</blockquote>;
    return line ? <p key={i}>{inline(line)}</p> : <div key={i} className="h-2" />;
  })}</article>;
}
