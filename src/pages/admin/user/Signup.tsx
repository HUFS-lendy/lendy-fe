import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import Logo from "../../../assets/cse-logo.png";
import { toast } from "sonner";
import { useState } from "react";
import { useSignUp } from "../../../api/auth.api";

const SignUp = () => {
  const [studentId, setStudentId] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { mutateAsync: doSignUp } = useSignUp();

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

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSignUp = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (!username.trim()) {
      toast("이름을 입력해주세요.");
      return;
    }

    if (!studentId.trim()) {
      toast("학번을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      toast("비밀번호를 입력해주세요.");
      return;
    }

    if (!email.trim()) {
      toast("이메일을 입력해주세요.");
      return;
    }

    if (!phone.trim()) {
      toast("전화번호를 입력해주세요.");
      return;
    }

    try {
      await doSignUp({ studentId, username, password, email, phone });
      toast("회원가입 되었습니다.");
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
          <form onSubmit={handleSignUp}>
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
                  학번 (아이디)
                </Label>
                <Input
                  id="studentId"
                  className="border border-neutral-400 text-sm"
                  placeholder="학번을 입력해주세요."
                  required
                  value={studentId}
                  onChange={handleStudentId}
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
                  value={password}
                  onChange={handlePassword}
                />
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

              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="phone">
                  전화번호
                </Label>
                <Input
                  id="phone"
                  className="border border-neutral-400 text-sm"
                  placeholder="전화번호를 입력해주세요."
                  required
                  value={phone}
                  onChange={handlePhone}
                />
              </div>
            </div>

            <button type="submit" className="hidden" />
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 mt-12 mb-12">
          <div
            onClick={() => handleSignUp()}
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
