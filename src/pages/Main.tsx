// Main.tsx
import Threads from "@/components/Threads";

const Main = () => {
  return (
    <section className="relative w-full h-full bg-[#04080c] overflow-hidden">
      {/* 배경 애니메이션 */}
      <Threads
        className="absolute inset-0"
        amplitude={2.2}
        distance={0.7}
        enableMouseInteraction={false}
      />

      {/* 가운데 오버레이 */}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-white text-center font-bold space-y-4">
          <div className="text-5xl">한국외국어대학교</div>
          <div className="text-5xl">컴퓨터공학부 기자재 대여 서비스</div>
        </div>
      </div>
    </section>
  );
};

export default Main;
