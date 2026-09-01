import { useState } from "react";
import { Link } from "react-router-dom";
import { Pin } from "lucide-react";
import { useNotices } from "../api/notice.api";
const date=(v:string)=>new Date(v).toLocaleDateString("ko-KR");
export default function AnnouncementList(){const[page,setPage]=useState(0);const{data,isLoading,isError}=useNotices(page);return <div className="min-h-screen bg-[#060a0c] px-6 py-20 text-white"><div className="mx-auto max-w-6xl">
  <p className="text-xs tracking-[.16em] text-neutral-500">NOTICE</p><h1 className="mt-3 text-4xl font-bold">공지사항</h1>
  <div className="mt-12 border-t-2 border-white">{isLoading?<p className="py-20 text-center text-neutral-500">불러오는 중...</p>:isError?<p className="py-20 text-center text-red-400">공지사항을 불러오지 못했습니다.</p>:data?.content.length===0?<p className="py-20 text-center text-neutral-500">등록된 공지사항이 없습니다.</p>:data?.content.map((n)=><Link key={n.noticeId} to={`/announcements/${n.noticeId}`} className="grid grid-cols-[80px_1fr_140px] items-center border-b border-white/10 px-3 py-6 hover:bg-white/[.04]">
    <span className="text-center text-sm text-neutral-500">{n.pinned?<Pin className="mx-auto h-4 w-4 text-emerald-400"/>:n.noticeId}</span><span className="truncate pr-6 text-[17px] font-medium">{n.title}</span><span className="text-right text-sm text-neutral-500">{date(n.createdAt)}</span></Link>)}</div>
  {(data?.totalPages??0)>1&&<div className="mt-8 flex justify-center gap-2"><button disabled={page===0} onClick={()=>setPage(p=>p-1)} className="border border-white/20 px-4 py-2 disabled:opacity-30">이전</button><span className="px-4 py-2 text-sm">{page+1} / {data?.totalPages}</span><button disabled={data?.last} onClick={()=>setPage(p=>p+1)} className="border border-white/20 px-4 py-2 disabled:opacity-30">다음</button></div>}
</div></div>}
