import { useNavigate } from "react-router-dom";
import Threads from "../components/Threads";
import FadeContent from "../components/FadeContent";

const Main = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-full bg-[#060a0c] overflow-hidden">
      {/* 배경 애니메이션 */}
      <Threads amplitude={2.2} distance={0.3} enableMouseInteraction={false} />
      <FadeContent
        blur={true}
        duration={1000}
        easing="ease-out"
        initialOpacity={0}
      >
        <div className="text-white px-8 sm:px-10 py-42 md:py-32 font-bold space-y-2 sm:space-y-4">
          <div className="text-2xl sm:text-5xl break-keep">
            한국외국어대학교
          </div>
          <div className="text-2xl sm:text-5xl break-keep">
            컴퓨터공학부 기자재 대여 서비스
          </div>
          <div
            onClick={() => navigate("/lend")}
            className="bg-[#060a0c] hover:bg-neutral-700 border border-white rounded-full text-white inline-block px-5 py-2 mt-6 cursor-pointer"
          >
            대여하러 가기
          </div>
        </div>
      </FadeContent>
    </section>
  );
};

export default Main;
