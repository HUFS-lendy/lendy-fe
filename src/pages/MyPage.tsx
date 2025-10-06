import { useNavigate } from "react-router-dom";
import Logo from "../assets/cse-logo.png";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { MdOutlineEdit } from "react-icons/md";

const MyPage = () => {
  const navigate = useNavigate();
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
              <BreadcrumbPage className="text-white">마이페이지</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 기본 정보 */}
      <div className="flex items-center space-x-8 md:space-x-12 py-12 md:p-12 text-white">
        <img src={Logo} className="w-20 h-20 md:w-24 md:h-24" />
        <div className="space-y-0.5">
          <div className="font-bold text-lg">이서연</div>
          <div>202202465 | 컴퓨터공학부</div>
          <div className="flex items-center space-x-4">
            <div>lsy0476@hufs.ac.kr</div>
            <MdOutlineEdit
              onClick={() => navigate("/email-change")}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
      {/* 메뉴 */}
      <div className="text-white px-2 md:px-12 space-y-12">
        {/* 대여 관리 */}
        <div>
          <div className="text-lg font-bold mb-2">대여 관리</div>
          <div className="mx-2">
            <div
              onClick={() => navigate("/lending-state")}
              className="border-b border-neutral-500 text-lg py-3 cursor-pointer"
            >
              대여 현황
            </div>
            <div
              onClick={() => navigate("/otp")}
              className="border-b border-neutral-500 text-lg py-3 cursor-pointer"
            >
              QR 코드
            </div>
          </div>
        </div>
        {/* 계정 관리 */}
        <div className="mb-32">
          <div className="text-lg font-bold mb-2">계정 관리</div>
          <div className="mx-2">
            <div
              onClick={() => navigate("/pw-change")}
              className="border-b border-neutral-500 text-lg py-3 cursor-pointer"
            >
              비밀번호 변경
            </div>
            <div
              onClick={() => navigate("/email-change")}
              className="border-b border-neutral-500 text-lg py-3 cursor-pointer"
            >
              이메일 변경
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
