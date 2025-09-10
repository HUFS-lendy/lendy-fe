import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../assets/cse-logo.png";

const EmailChange = () => {
  const navigate = useNavigate();
  return (
    <div className=" bg-[#060a0c] w-screen h-full pt-24 flex flex-col items-center">
      <div className="space-y-4 mb-4 flex flex-col justify-center items-center">
        <img src={Logo} className="w-14 h-14" />
        <div className="text-white text-xl text-center">이메일 변경</div>
        <div className="text-neutral-400 text-xs text-center space-y-0.5">
          <div>
            이메일 재설정을 위해선 비밀번호와 이메일을 통한 본인 인증이
            필요합니다
          </div>
          <div>
            본인의 비밀번호와 새 이메일 주소를 입력하면 해당하는 이메일로 인증
            코드가 전송됩니다
          </div>
        </div>
      </div>
      <Card className="w-full max-w-sm bg-[#060a0c] text-white border-none">
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  비밀번호
                </Label>
                <Input
                  className="border border-neutral-400"
                  id="email"
                  type="email"
                  placeholder="비밀번호를 입력해주세요."
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="password">
                    새 이메일
                  </Label>
                </div>
                <Input
                  className="border border-neutral-400"
                  id="password"
                  type="password"
                  required
                  placeholder="새 이메일을 입력해주세요."
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-4">
          <div
            onClick={() => navigate("/")}
            className="w-full border border-neutral-400 hover:bg-neutral-900 rounded-sm text-center py-1 cursor-pointer"
          >
            이메일 변경
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailChange;
