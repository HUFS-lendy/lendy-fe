import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../assets/cse-logo.png";
import {
  usePasswordResetRequest,
  usePasswordResetConfirm,
} from "../api/auth.api";

const CODE_EXPIRE_SECONDS = 10 * 60;

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const PwReset = () => {
  const navigate = useNavigate();

  const passwordResetRequestMutation = usePasswordResetRequest();
  const passwordResetConfirmMutation = usePasswordResetConfirm();

  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(CODE_EXPIRE_SECONDS);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isCodeSent) return;
    if (remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCodeSent, remainingSeconds]);

  const handleRequestCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage("");

    if (!studentId || !email) {
      setErrorMessage("학번과 이메일을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await passwordResetRequestMutation.mutateAsync({
        studentId,
        email,
      });

      alert(res.message || "인증 코드가 전송되었습니다.");
      setIsCodeSent(true);
      setRemainingSeconds(CODE_EXPIRE_SECONDS);
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "인증 코드 요청에 실패했습니다.";
      setErrorMessage(msg);
    }
  };

  const handleResetPassword = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage("");

    if (!studentId || !email || !code || !newPassword || !confirmPassword) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }

    if (remainingSeconds <= 0) {
      setErrorMessage("인증 코드가 만료되었습니다. 다시 요청해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await passwordResetConfirmMutation.mutateAsync({
        studentId,
        email,
        code,
        newPassword,
        confirmPassword,
      });

      alert(res.message || "비밀번호가 재설정되었습니다.");
      navigate("/login");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "비밀번호 재설정에 실패했습니다.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="bg-[#060a0c] w-screen h-full pt-24 flex flex-col items-center">
      <div className="space-y-4 mb-4 flex flex-col justify-center items-center">
        <img src={Logo} className="w-14 h-14" />
        <div className="text-white text-xl text-center">비밀번호 재설정</div>
        <div className="text-neutral-400 text-xs md:text-sm px-8 break-keep text-center space-y-1 md:space-y-0.5">
          <div>
            가입한 학번과 이메일을 입력하면 비밀번호 재설정용 인증 코드가
            전송됩니다
          </div>
          <div>
            인증 코드와 새 비밀번호를 입력하면 비밀번호 재설정이 완료됩니다
          </div>
        </div>
      </div>

      <Card className="w-full max-w-sm bg-[#060a0c] text-white border-none">
        <CardContent>
          <form onSubmit={isCodeSent ? handleResetPassword : handleRequestCode}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="studentId">
                  학번
                </Label>
                <Input
                  className="border border-neutral-400 text-sm"
                  id="studentId"
                  type="text"
                  placeholder="학번을 입력해주세요."
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={isCodeSent}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  이메일
                </Label>
                <Input
                  className="border border-neutral-400 text-sm"
                  id="email"
                  type="email"
                  placeholder="가입한 이메일을 입력해주세요."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isCodeSent}
                  required
                />
              </div>

              {isCodeSent && (
                <>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="pb-1 text-md" htmlFor="code">
                        인증 코드
                      </Label>
                      <div className="text-xs text-neutral-400">
                        남은 시간 {formatTime(remainingSeconds)}
                      </div>
                    </div>
                    <Input
                      className="border border-neutral-400 text-sm"
                      id="code"
                      type="text"
                      placeholder="이메일로 받은 인증 코드를 입력해주세요."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="pb-1 text-md" htmlFor="newPassword">
                      새 비밀번호
                    </Label>
                    <Input
                      className="border border-neutral-400 text-sm"
                      id="newPassword"
                      type="password"
                      placeholder="새 비밀번호를 입력해주세요."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="pb-1 text-md" htmlFor="confirmPassword">
                      새 비밀번호 확인
                    </Label>
                    <Input
                      className="border border-neutral-400 text-sm"
                      id="confirmPassword"
                      type="password"
                      placeholder="새 비밀번호를 한번 더 입력해주세요."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="text-sm text-red-400">{errorMessage}</div>
              )}
            </div>

            <button type="submit" className="hidden" />
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 mt-4">
          {!isCodeSent ? (
            <button
              type="button"
              onClick={handleRequestCode}
              disabled={passwordResetRequestMutation.isPending}
              className="w-full border border-neutral-400 bg-neutral-900 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer disabled:opacity-50"
            >
              {passwordResetRequestMutation.isPending
                ? "인증 코드 전송 중..."
                : "인증 코드 요청"}
            </button>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={
                  passwordResetConfirmMutation.isPending ||
                  remainingSeconds <= 0
                }
                className="w-full border border-neutral-400 bg-neutral-900 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer disabled:opacity-50"
              >
                {passwordResetConfirmMutation.isPending
                  ? "재설정 중..."
                  : "비밀번호 재설정"}
              </button>

              <button
                type="button"
                onClick={handleRequestCode}
                disabled={passwordResetRequestMutation.isPending}
                className="w-full border border-neutral-700 bg-[#060a0c] hover:bg-neutral-900 rounded-sm text-center py-1 cursor-pointer text-neutral-300 disabled:opacity-50"
              >
                인증 코드 재전송
              </button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PwReset;