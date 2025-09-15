import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#060a0c] text-white px-4">
      <img
        className="w-50 h-10"
        src="https://computer.hufs.ac.kr/sites/computer/masterSkin/computer_JW_MS_K2WT001_M/images/logo_footer.svg"
        alt="한국외국어대학교"
      />
      <div className="flex flex-col items-end pb-4 space-y-2 text-xs text-right">
        <div className="flex space-x-2">
          <div className="font-bold">ADDRESS</div>
          <div>경기도 용인시 처인구 모현읍 외대로 81</div>
        </div>
        <div className="flex space-x-4">
          <div className="flex space-x-2">
            <div className="font-bold">TEL</div>
            <div>031-330-4268</div>
          </div>
          <div className="flex space-x-2">
            <div className="font-bold">EMAIL</div>
            <div>ces@hufs.ac.kr</div>
          </div>
        </div>
        <div
          onClick={() => navigate("/devices")}
          className="hover:underline cursor-pointer"
        >
          관리자
        </div>
      </div>
    </div>
  );
};

export default Footer;
