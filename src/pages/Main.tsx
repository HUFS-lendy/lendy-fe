import Threads from "@/components/Threads";

const Main = () => {
  return (
    <section className="relative w-full h-full bg-[#060a0c] overflow-hidden">
      {/* 배경 애니메이션 */}
      <Threads
        className="absolute inset-0"
        amplitude={2.2}
        distance={0.1}
        enableMouseInteraction={false}
      />

      <div className="text-white px-10 py-24 font-bold space-y-4">
        <div className="text-5xl">한국외국어대학교</div>
        <div className="text-5xl">컴퓨터공학부 기자재 대여 서비스</div>
        <div className="bg-[#060a0c] hover:bg-neutral-700 border border-white rounded-full text-white inline-block px-5 py-2 mt-6 cursor-pointer">
          대여하러 가기
        </div>
      </div>
    </section>
  );
};

export default Main;
