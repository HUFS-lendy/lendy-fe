import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";

export const QrModal: React.FC<{
  value: string; // QR 값
  title?: string; // 모달 제목
  description?: string; // 설명
}> = ({
  value,
  title = "QR 코드",
  description = "학과 사무실에서 QR을 제시해 주세요.",
}) => {
  return (
    <AlertDialog>
      {/* 아이콘이 트리거 */}
      <AlertDialogTrigger asChild>
        <button aria-label="QR 보기" className="mx-auto block">
          <QrCode size={18} className="text-white cursor-pointer" />
        </button>
      </AlertDialogTrigger>

      {/* 모달 본문 */}
      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {/* QR 코드 박스*/}
        <div className="flex justify-center py-4">
          <div className="relative w-56 h-56 rounded-xl bg-white shadow flex items-center justify-center">
            <QRCode
              value={value}
              size={184}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-black text-white cursor-pointer hover:bg-black hover:text-white">
            닫기
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
