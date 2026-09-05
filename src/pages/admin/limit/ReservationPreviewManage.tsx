import { ExternalLink, MonitorPlay } from "lucide-react";

const stages = [
  { key: "flow", title: "전체 자동 시뮬레이션", description: "서버시간 확인부터 예약 페이지 입장, 요청 처리 및 예약 완료까지 자동으로 재현합니다." },
  { key: "hidden", title: "예약 서비스 공개 전", description: "예약 서비스 이용 가능 시각 전 학생에게 표시되는 안내입니다." },
  { key: "countdown", title: "예약 시작 전 서버시간", description: "예약 시작 전에 학생에게 제공되는 서버시간 화면입니다." },
  { key: "before-open", title: "예약 시작 전 메뉴 선택", description: "예약 시작 시각 전에 기자재 예약 메뉴를 눌렀을 때의 안내입니다." },
  { key: "selection", title: "기자재 선택", description: "예약 시작 후 실제 기자재를 선택하는 화면입니다." },
  { key: "confirm", title: "예약 확인", description: "기자재 선택 후 대여 버튼을 눌렀을 때의 확인 창입니다." },
  { key: "pledge", title: "서약 조항", description: "예약 전 확인하고 동의해야 하는 서약서 화면입니다." },
  { key: "processing", title: "예약 요청 처리", description: "동시 요청을 순서대로 처리하는 동안 표시되는 진행 화면입니다." },
  { key: "success", title: "예약 완료", description: "예약 성공 알림과 완료 후 안내 상태를 확인합니다." },
  { key: "limit", title: "학기당 1대 제한", description: "이미 기자재를 예약하거나 대여한 학생의 추가 신청 안내입니다." },
  { key: "failure", title: "예약 실패", description: "재고 부족 등 예약 실패 알림 상태를 확인합니다." },
];

export default function ReservationPreviewManage() {
  const open = (stage: string) => window.open(`/reservation-preview?stage=${stage}`, "_blank", "noopener,noreferrer");
  return (
    <div className="min-h-full bg-[#060a0c] px-8 pb-16 pt-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-8 border-b border-white/10 pb-8">
          <div>
            <p className="text-xs tracking-[0.16em] text-neutral-500">RESERVATION PREVIEW</p>
            <h1 className="mt-3 text-3xl font-bold">예약 화면 시뮬레이션</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">실제 예약 데이터와 재고를 변경하지 않고 학생이 보는 예약 전 과정을 단계별로 확인합니다.</p>
          </div>
          <button onClick={() => open("flow")} className="flex shrink-0 items-center gap-2 bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200">
            <MonitorPlay className="h-4 w-4" /> 전체 시뮬레이션 실행
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stages.map((stage, index) => (
            <button key={stage.key} onClick={() => open(stage.key)} className="group min-h-44 border border-white/10 bg-[#0b1015] p-6 text-left transition hover:border-white/30 hover:bg-white/[0.05]">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-emerald-400">STEP {String(index + 1).padStart(2, "0")}</span>
                <ExternalLink className="h-4 w-4 text-neutral-600 group-hover:text-white" />
              </div>
              <h2 className="mt-6 text-lg font-semibold">{stage.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{stage.description}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 border border-emerald-500/20 bg-emerald-500/[0.05] px-5 py-4 text-sm leading-6 text-neutral-400">
          미리보기 화면의 상단 단계 선택기를 이용하면 새 창을 닫지 않고 전체 흐름을 연속해서 확인하거나 화면 녹화할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
