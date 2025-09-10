import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../assets/cse-logo.png";

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className=" bg-[#060a0c] w-screen h-full 2xl:pt-42 pt-32 flex flex-col items-center">
      <div className="space-y-4 mb-4">
        <img src={Logo} className="w-14 h-14" />
        <div className="text-white text-xl text-center">로그인</div>
      </div>
      <Card className="w-full max-w-sm bg-[#060a0c] text-white border-none">
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  학번
                </Label>
                <Input
                  className="border border-neutral-400"
                  id="email"
                  type="email"
                  placeholder="학번을 입력해주세요."
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="password">
                    비밀번호
                  </Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                  >
                    비밀번호 재설정
                  </a>
                </div>
                <Input
                  className="border border-neutral-400"
                  id="password"
                  type="password"
                  required
                  placeholder="비밀번호를 입력해주세요."
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
            로그인
          </div>
        </CardFooter>
      </Card>
      <div className="text-center text-neutral-400 text-sm pt-4">
        * 초기 비밀번호는 학번입니다. 로그인 후 변경해주세요.
      </div>
    </div>
  );
};

export default Login;
