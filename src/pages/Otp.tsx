import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import QRCode from "react-qr-code";

const Otp = () => {
  return (
    <div className="bg-[#060a0c] w-screen h-screen px-8">
      {/* 브래드크럼 */}
      <div className="pt-20">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100 cursor-pointer"
                href="/"
              >
                홈
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">QR 코드</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="pt-8">
          <div className="font-bold text-white text-3xl pb-4">QR 인증</div>
          {/* QR코드 부분 */}
          <div className="w-full flex justify-center">
            <div className="mt-10 w-full max-w-sm  bg-[#11141b] rounded-3xl shadow-xl pt-6 px-6 pb-24">
              {/* 상단 안내 박스 */}
              <div className="px-5 py-4 text-center">
                <h3 className="font-semibold text-2xl text-white">
                  QR 코드를 통한 본인 인증
                </h3>
                <p className="text-sm text-gray-400 mt-4 break-keep">
                  학과 사무실에서 QR 코드로 본인 인증 후<br /> 기기를 대여할 수
                  있습니다.
                </p>
              </div>

              {/* 스캐닝 프레임 + QR */}
              <div className="mt-8 flex items-center justify-center">
                <div className="relative w-56 h-56 rounded-xl bg-white shadow-md flex items-center justify-center">
                  {/* 파란 코너 4개 */}
                  <div className="pointer-events-none">
                    <span className="absolute left-0 top-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg animate-pulse" />
                    <span className="absolute right-0 top-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg animate-pulse" />
                    <span className="absolute left-0 bottom-0 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg animate-pulse" />
                    <span className="absolute right-0 bottom-0 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg animate-pulse" />
                  </div>

                  {/* 라이브러리 사용 */}
                  <QRCode
                    value="https://example.com/check-in?otp=123456"
                    size={168}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Otp;
