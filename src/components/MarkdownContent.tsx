import type { ReactNode } from "react";

const inline=(text:string):ReactNode[]=>{
  const regex=/(!?\[[^\]]*\]\([^\s)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g; const out:ReactNode[]=[]; let last=0;
  for(const match of text.matchAll(regex)){if(match.index!>last)out.push(text.slice(last,match.index));const token=match[0];
    if(token.startsWith("![")){const m=token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);if(m)out.push(<img key={match.index} src={m[2]} alt={m[1]} className="my-6 max-h-[620px] w-auto max-w-full border border-white/10 object-contain"/>);}
    else if(token.startsWith("[")){const m=token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);if(m)out.push(<a key={match.index} href={m[2]} target="_blank" rel="noreferrer" className="text-emerald-400 underline">{m[1]}</a>);}
    else if(token.startsWith("`"))out.push(<code key={match.index} className="bg-white/10 px-1.5 py-0.5 text-emerald-300">{token.slice(1,-1)}</code>);
    else out.push(<strong key={match.index}>{token.slice(2,-2)}</strong>);last=match.index!+token.length;}if(last<text.length)out.push(text.slice(last));return out;
};
export default function MarkdownContent({content}:{content:string}){let code=false;const lines=content.split("\n");return <article className="space-y-4 break-words text-[16px] leading-8 text-neutral-200">{lines.map((line,i)=>{
  if(line.startsWith("```")){code=!code;return null;}if(code)return <pre key={i} className="overflow-x-auto bg-black/40 px-5 py-3 font-mono text-sm text-neutral-300">{line}</pre>;
  if(line.startsWith("### "))return <h3 key={i} className="pt-5 text-xl font-bold">{inline(line.slice(4))}</h3>;
  if(line.startsWith("## "))return <h2 key={i} className="border-b border-white/10 pb-3 pt-8 text-2xl font-bold">{inline(line.slice(3))}</h2>;
  if(line.startsWith("# "))return <h1 key={i} className="pt-8 text-3xl font-bold">{inline(line.slice(2))}</h1>;
  if(line.startsWith("- "))return <div key={i} className="flex gap-3 pl-2"><span>•</span><p>{inline(line.slice(2))}</p></div>;
  if(line.startsWith("> "))return <blockquote key={i} className="border-l-4 border-emerald-500 bg-emerald-500/5 px-5 py-3 text-neutral-300">{inline(line.slice(2))}</blockquote>;
  return line?<p key={i}>{inline(line)}</p>:<div key={i} className="h-2"/>;})}</article>}
