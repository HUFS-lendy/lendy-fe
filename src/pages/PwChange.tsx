import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../assets/cse-logo.png";

const PwChange = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#060a0c] w-screen h-screen pt-24 flex flex-col items-center">
      <div className="space-y-4 mb-4 flex flex-col justify-center items-center">
        <img src={Logo} className="w-12 h-12" />
        <div className="text-white text-xl text-center font-bold">
          비밀번호 변경
        </div>
      </div>
      <Card className="w-full max-w-sm bg-[#060a0c] text-white border-none">
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  기존 비밀번호
                </Label>
                <Input
                  className="border border-neutral-400 text-sm"
                  placeholder="기존 비밀번호를 입력해주세요."
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="password">
                    새 비밀번호
                  </Label>
                </div>
                <Input
                  className="border border-neutral-400 text-sm"
                  id="password"
                  type="password"
                  required
                  placeholder="새 비밀번호를 입력해주세요."
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="password">
                    새 비밀번호 확인
                  </Label>
                </div>
                <Input
                  className="border border-neutral-400 text-sm"
                  id="password"
                  type="password"
                  required
                  placeholder="새 비밀번호를 한번 더 입력해주세요."
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-8">
          <div
            onClick={() => navigate("/")}
            className="w-full border border-neutral-400 bg-neutral-900 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer"
          >
            비밀번호 변경
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PwChange;
