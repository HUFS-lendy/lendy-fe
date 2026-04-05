import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../assets/cse-logo.png";
import { useEmailChangeRequest, useEmailVerify } from "../api/user.api";
import axios from "axios";

const EMAIL_CODE_EXPIRE_SECONDS = 10 * 60;

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const EmailChange = () => {
  const navigate = useNavigate();
  const emailChangeRequestMutation = useEmailChangeRequest();
  const emailVerifyMutation = useEmailVerify();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [code, setCode] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    EMAIL_CODE_EXPIRE_SECONDS,
  );
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

    if (!currentPassword || !newEmail) {
      setErrorMessage("비밀번호와 새 이메일을 모두 입력해주세요.");
      return;
    }

    try {
      const res = await emailChangeRequestMutation.mutateAsync({
        currentPassword,
        newEmail,
      });

      alert(res.message || "인증 코드가 전송되었습니다.");
      setIsCodeSent(true);
      setRemainingSeconds(EMAIL_CODE_EXPIRE_SECONDS);
      setCode("");
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "인증 코드 요청에 실패했습니다.";
      setErrorMessage(msg);
    }
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage("");

    if (!code) {
      setErrorMessage("인증 코드를 입력해주세요.");
      return;
    }

    if (remainingSeconds <= 0) {
      setErrorMessage("인증 코드가 만료되었습니다. 다시 요청해주세요.");
      return;
    }

    try {
      const res = await emailVerifyMutation.mutateAsync({ code });

      alert(res.message || "이메일이 변경되었습니다.");
      navigate("/mypage");
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message
        : "이메일 변경에 실패했습니다.";
      setErrorMessage(msg);
    }
  };
  return (
    <div className=" bg-[#060a0c] w-screen h-full pt-24 flex flex-col items-center">
      <div className="space-y-4 mb-4 flex flex-col justify-center items-center">
        <img src={Logo} className="w-14 h-14" />
        <div className="text-white text-xl text-center">이메일 변경</div>
        <div className="text-neutral-400 text-xs md:text-sm px-8 break-keep text-center space-y-1 md:space-y-0.5">
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
          <form onSubmit={isCodeSent ? handleVerifyCode : handleRequestCode}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="email">
                  비밀번호
                </Label>
                <Input
                  className="border border-neutral-400 text-sm"
                  id="currentPassword"
                  type="password"
                  placeholder="비밀번호를 입력해주세요."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isCodeSent}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="newEmail">
                    새 이메일
                  </Label>
                </div>
                <Input
                  className="border border-neutral-400 text-sm"
                  id="newEmail"
                  type="email"
                  placeholder="새 이메일을 입력해주세요."
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={isCodeSent}
                  required
                />
              </div>

              {isCodeSent && (
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
              disabled={emailChangeRequestMutation.isPending}
              className="w-full border border-neutral-400 bg-neutral-900 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer disabled:opacity-50"
            >
              {emailChangeRequestMutation.isPending
                ? "인증 코드 전송 중..."
                : "이메일 변경"}
            </button>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={
                  emailVerifyMutation.isPending || remainingSeconds <= 0
                }
                className="w-full border border-neutral-400 bg-neutral-900 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer disabled:opacity-50"
              >
                {emailVerifyMutation.isPending
                  ? "인증 중..."
                  : "인증 후 이메일 변경"}
              </button>

              <button
                type="button"
                onClick={handleRequestCode}
                disabled={emailChangeRequestMutation.isPending}
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

export default EmailChange;
