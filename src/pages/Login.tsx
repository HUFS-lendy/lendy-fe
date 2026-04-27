import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../assets/cse-logo.png";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => {
    return studentId.trim().length > 0 && password.length > 0 && !isSubmitting;
  }, [studentId, password, isSubmitting]);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const { message } = await login({
        id: studentId.trim(),
        password,
      });

      toast(message ?? "로그인 되었습니다.");
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "로그인에 실패했습니다.";
      toast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#060a0c] w-screen h-full 2xl:pt-42 pt-32 flex flex-col items-center">
      <div className="space-y-4 mb-4 flex flex-col justify-center items-center">
        <img src={Logo} className="w-14 h-14" alt="logo" />
        <div className="text-white text-xl text-center">로그인</div>
      </div>

      <Card className="w-full max-w-sm bg-[#060a0c] text-white border-none">
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="studentId">
                  학번
                </Label>
                <Input
                  id="studentId"
                  className="border border-neutral-400 text-sm"
                  placeholder="학번을 입력해주세요."
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="password">
                    비밀번호
                  </Label>
                  <button
                    type="button"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline cursor-pointer"
                    onClick={() => navigate("/pw-reset")}
                  >
                    비밀번호 재설정
                  </button>
                </div>
                <div className="relative">
                  <Input
                    className="border border-neutral-400 text-sm pr-10"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void handleLogin();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* 엔터 제출용 */}
            <button type="submit" className="hidden" />
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 mt-4">
          <div
            onClick={() => void handleLogin()}
            aria-disabled={!canSubmit}
            className={[
              "w-full border border-neutral-400 rounded-sm text-center py-1 select-none",
              canSubmit
                ? "bg-neutral-900 hover:bg-neutral-800 cursor-pointer"
                : "bg-neutral-900/40 text-neutral-400 cursor-not-allowed",
            ].join(" ")}
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
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
