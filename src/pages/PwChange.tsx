import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../assets/cse-logo.png";
import { usePasswordChange } from "../api/user.api";

const PwChange = () => {
  const navigate = useNavigate();

  const passwordChangeMutation = usePasswordChange();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await passwordChangeMutation.mutateAsync({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      alert(res.message || "비밀번호가 변경되었습니다.");
      navigate("/mypage");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const msg =
        axiosError?.response?.data?.message || "비밀번호 변경에 실패했습니다.";
      setErrorMessage(msg);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label className="pb-1 text-md" htmlFor="currentPassword">
                  기존 비밀번호
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="border border-neutral-400 text-sm"
                  placeholder="기존 비밀번호를 입력해주세요."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="newPassword">
                    새 비밀번호
                  </Label>
                </div>
                <Input
                  id="newPassword"
                  type="password"
                  className="border border-neutral-400 text-sm"
                  placeholder="새 비밀번호를 입력해주세요."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="pb-1 text-md" htmlFor="password">
                    새 비밀번호 확인
                  </Label>
                </div>
                <Input
                  id="confirmPassword"
                  type="password"
                  className="border border-neutral-400 text-sm"
                  placeholder="새 비밀번호를 한번 더 입력해주세요."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {errorMessage && (
                <div className="text-sm text-red-400">{errorMessage}</div>
              )}
            </div>

            <button type="submit" className="hidden" />
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2 mt-8">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={passwordChangeMutation.isPending}
            className="w-full border border-neutral-400 bg-neutral-900 hover:bg-neutral-800 rounded-sm text-center py-1 cursor-pointer disabled:opacity-50"
          >
            {passwordChangeMutation.isPending ? "변경 중..." : "비밀번호 변경"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PwChange;
