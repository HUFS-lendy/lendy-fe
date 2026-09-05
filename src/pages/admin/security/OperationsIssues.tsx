import { useState } from "react";
import { acknowledgeIssue, testOperationsAlert, useAlertDelivery, useOperationsIssues } from "../../../api/securityMonitoring.api";

const labels:Record<string,string> = { SUSPICIOUS_REQUEST_BURST:"반복 요청 검토", DATABASE_LOCK_FAILURE:"DB 잠금 오류", HTTP_SERVER_ERROR:"서버 요청 오류", SLOW_REQUEST:"느린 요청", DATABASE_DOWN:"DB 연결 실패", REDIS_DOWN:"Redis 연결 실패", DB_POOL_WAIT:"DB 연결 대기", MEMORY:"메모리 사용 증가", SERVER_ERRORS:"서버 오류 증가" };
export default function OperationsIssues(){
 const issues=useOperationsIssues(), delivery=useAlertDelivery();
 const [all,setAll]=useState(false), [error,setError]=useState(""), [busy,setBusy]=useState<string|null>(null);
 const [testMessage,setTestMessage]=useState("");
 const sendTest=async()=>{setBusy("test");try{const result=await testOperationsAlert();setTestMessage(result.data.message);}catch{setTestMessage("테스트 알림 등록에 실패했습니다.");}finally{setBusy(null);}};
 const rows=(issues.data||[]).filter(i=>all||!i.acknowledged);
 const ack=async(id:string)=>{setBusy(id);setError("");try{await acknowledgeIssue(id);await issues.refetch();}catch{setError("확인 상태를 저장하지 못했습니다.");}finally{setBusy(null);}};
 return <section className="mt-4 rounded-xl border border-neutral-700 bg-[#0b1014] p-5">
  <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold">운영자 검토함</h2><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={all} onChange={e=>setAll(e.target.checked)}/>확인한 이슈 포함</label></div>
  <p className="mt-2 text-sm leading-6 text-neutral-300">반복 요청은 매크로의 확정 증거가 아닙니다. 사용자 ID와 요청 간격을 확인하고, IP 집중은 학교 공유 Wi-Fi 이용 여부와 함께 판단하세요. 확인 처리는 오류 해결이나 사용자 차단을 의미하지 않습니다.</p>
  <div className="my-4 rounded-lg bg-white/5 p-3 text-sm leading-6">
   <p>이메일 알림: {delivery.data?.enabled?delivery.data.recipient:"꺼짐 / 설정 확인 필요"}</p>
   <button disabled={!!busy||!delivery.data?.enabled} onClick={()=>void sendTest()} className="my-2 rounded border border-neutral-600 px-3 py-1 disabled:opacity-50">테스트 알림 보내기</button>
   {testMessage&&<p role="status">{testMessage}</p>}
   <p className="text-neutral-400">{delivery.data?.retention || "알림 상태를 불러오는 중입니다."}</p>
   {delivery.data&&<p>최근 발송: {delivery.data.lastSentAt?new Date(delivery.data.lastSentAt).toLocaleString("ko-KR"):"없음"} · 대기 {delivery.data.pending}건 · 큐 초과 {delivery.data.dropped}건</p>}
   {delivery.data?.lastFailureAt&&<p className="text-red-300">메일 발송 실패 기록: {new Date(delivery.data.lastFailureAt).toLocaleString("ko-KR")} — SMTP 설정과 서버 로그를 확인하세요.</p>}
  </div>
  {(error||issues.isError||delivery.isError)&&<p role="alert" className="text-red-300">{error||"일부 모니터링 정보를 불러오지 못했습니다."}</p>}
  <div className="space-y-3">{rows.map(i=><article key={i.id} className={`rounded-lg border p-4 ${i.severity==="CRITICAL"?"border-red-900 bg-red-950/15":"border-amber-900 bg-amber-950/10"}`}>
   <div className="flex flex-wrap items-center justify-between gap-2"><strong>{labels[i.code]||i.code}</strong><span className="text-xs text-neutral-400">{new Date(i.lastSeen).toLocaleString("ko-KR")} · {i.occurrences}회</span></div>
   <p className="mt-2 break-all font-mono text-sm leading-6 text-neutral-200">{i.evidence}</p>
   <p className="mt-2 text-xs text-neutral-400">로그 ID: {i.id} · 최초 {new Date(i.firstSeen).toLocaleString("ko-KR")}</p>
   <button disabled={!!busy||i.acknowledged} onClick={()=>void ack(i.id)} className="mt-3 rounded border border-neutral-600 px-3 py-1.5 text-sm disabled:opacity-50">{i.acknowledged?"검토 확인됨":busy===i.id?"저장 중…":"검토 확인"}</button>
  </article>)}{!rows.length&&!issues.isLoading&&!issues.isError&&<p className="py-6 text-neutral-400">검토할 이슈가 없습니다.</p>}</div>
  <p className="mt-4 text-xs leading-5 text-neutral-400">서버 로그 확인: docker logs --since 15m --tail 500 lendy-backend<br/>requestId가 있는 오류는 해당 ID로 검색할 수 있습니다. 서버 전체 중단 감지는 별도의 외부 모니터링이 필요합니다.</p>
 </section>;
}
