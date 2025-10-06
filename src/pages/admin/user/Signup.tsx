import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import Logo from "../../../assets/cse-logo.png";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div className=" bg-[#060a0c] w-screen pt-6 flex flex-col items-center">
      {/* 이미지 & 제목 */}
      <div className="space-y-4 mb-4  flex flex-col justify-center items-center">
        <img src={Logo} className="w-14 h-14" />
        <div className="text-white text-xl text-center">회원가입</div>
      </div>
      <Card className="w-full max-w-sm bg-[#060a0c] text-white border-none">
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  이름
                </Label>
                <Input
                  className="border border-neutral-400 text-sm"
                  placeholder="이름을 입력해주세요."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  학번
                </Label>
                <Input
                  className="border border-neutral-400 text-sm"
                  placeholder="학번을 입력해주세요."
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  아이디
                </Label>
                <Input
                  className="border border-neutral-400 text-sm"
                  placeholder="아이디를 입력해주세요."
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="password">
                    비밀번호
                  </Label>
                </div>
                <Input
                  className="border border-neutral-400 text-sm"
                  id="password"
                  type="password"
                  required
                  placeholder="비밀번호를 입력해주세요."
                />
              </div>
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  이메일
                </Label>
                <Input
                  className="border border-neutral-400 text-sm"
                  placeholder="이메일을 입력해주세요."
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-12 mb-12">
          <div
            onClick={() => {
              navigate("/admin/users");
              toast("회원가입 되었습니다.");
            }}
            className="w-full border bg-neutral-900 border-neutral-400 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer"
          >
            회원가입
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
