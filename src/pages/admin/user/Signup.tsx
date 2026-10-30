import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import Logo from "../../../assets/cse-logo.png";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useSignUp } from "../../../api/auth.api";

const SignUp = () => {
  const [studentId, setStudentId] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: doSignUp, isPending } = useSignUp();

  const navigate = useNavigate();

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleStudentId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSignUp = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (isPending) return;

    if (!username.trim()) {
      toast("이름을 입력해주세요.");
      return;
    }

    if (username.trim().length < 2 || username.trim().length > 20) {
      toast.error("이름은 2~20자로 입력해주세요.");
      return;
    }

    if (studentId.trim().length < 4 || studentId.trim().length > 20) {
      toast.error("학번 또는 사번은 4~20자로 입력해주세요. 7자리 사번도 사용할 수 있습니다.");
      return;
    }

    if (!password.trim()) {
      toast("비밀번호를 입력해주세요.");
      return;
    }

    if (password.length < 7 || password.length > 20) {
      toast.error("비밀번호는 7~20자로 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      toast("이메일을 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      const res = await doSignUp({
        studentId: studentId.trim(),
        username: username.trim(),
        password,
        email: email.trim(),
      });
      toast.success(res.message ?? "회원가입 되었습니다.");
      navigate("/admin/users");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "회원 가입 중 오류가 발생했습니다.";
      toast(errorMessage);
    }
  };

  return (
    <div className="bg-[#060a0c] w-screen pt-6 flex flex-col items-center">
      <div className="space-y-4 mb-4 flex flex-col justify-center items-center">
        <img src={Logo} className="w-14 h-14" alt="logo" />
        <div className="text-white text-xl text-center">회원가입</div>
      </div>

      <Card className="w-full max-w-sm bg-[#060a0c] text-white border-none">
        <CardContent>
          <form id="signup-form" onSubmit={handleSignUp} noValidate>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="username">
                  이름
                </Label>
                <Input
                  id="username"
                  className="border border-neutral-400 text-sm"
                  placeholder="이름을 입력해주세요."
                  required
                  value={username}
                  onChange={handleUsername}
                />
              </div>

              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="studentId">
                  학번 / 사번 (아이디)
                </Label>
                <Input
                  id="studentId"
                  className="border border-neutral-400 text-sm"
                  placeholder="학번 또는 사번을 입력해주세요."
                  aria-describedby="student-id-help"
                  required
                  value={studentId}
                  onChange={handleStudentId}
                />
                <p id="student-id-help" className="text-sm text-neutral-400">
                  4~20자 · 교수님은 7자리 사번으로도 등록할 수 있습니다.
                </p>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="password">
                    비밀번호
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    className="border border-neutral-400 text-sm pr-10"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="7~20자로 입력해주세요."
                    aria-describedby="password-help"
                    autoComplete="new-password"
                    value={password}
                    onChange={handlePassword}
                  />

                  <button
                    type="button"
                    aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p id="password-help" className="text-sm text-neutral-400">
                  비밀번호는 7~20자로 입력해주세요.
                </p>
              </div>

              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  이메일
                </Label>
                <Input
                  id="email"
                  className="border border-neutral-400 text-sm"
                  placeholder="이메일을 입력해주세요."
                  required
                  value={email}
                  onChange={handleEmail}
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 mt-12 mb-12">
          <button
            type="submit"
            form="signup-form"
            disabled={isPending}
            className="w-full border bg-neutral-900 border-neutral-400 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "등록 중..." : "회원가입"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
