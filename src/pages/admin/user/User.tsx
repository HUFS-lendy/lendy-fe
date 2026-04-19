import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { Input } from "../../../components/ui/input";
import { DeviceCategoryCombobox } from "../../../components/ui/DeviceCategory";
import { Checkbox } from "../../../components/ui/checkbox";
import { DeviceStateCombobox } from "../../../components/ui/DeviceStateCombobox";
import { toast } from "sonner";
import { useFetchUser } from "../../../api/admin.api";
import { useUserRentals } from "../../../api/adminUser.api";
import { useReturnReservation } from "../../../api/adminRental.api";

const User = () => {
  const [categoryName, setCategoryName] = useState("");
  const [selectedRentalId, setSelectedRentalId] = useState<number | null>(null);
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = Number(userId);

  const { data: user } = useFetchUser(numericUserId);
  const { data: rentals = [] } = useUserRentals(numericUserId);
  const { mutate: returnReservation, isPending: isReturning } =
    useReturnReservation();

  const selectedRental = useMemo(
    () =>
      rentals.find((rental) => rental.rentalId === selectedRentalId) ?? null,
    [rentals, selectedRentalId],
  );

  const handleReturnRental = () => {
    if (!selectedRental) {
      toast("반납할 대여 기록을 선택해주세요.");
      return;
    }

    returnReservation(
      { rentalId: selectedRental.rentalId },
      {
        onSuccess: () => {
          toast("기자재가 반납 처리되었습니다.");
          setSelectedRentalId(null);
        },
        onError: () => {
          toast("반납 처리에 실패했습니다.");
        },
      },
    );
  };

  return (
    <div className="w-screen px-8 text-white">
      <div className="pt-14">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/admin"
              >
                홈
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/admin/users"
              >
                사용자 관리
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                {user?.username}의 대여 기록
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-4">
          {user?.username}
        </div>
      </div>

      <div className="flex space-x-4 justify-end">
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="hover:bg-neutral-800 cursor-pointer border border-neutral-400 text-neutral-200 text-sm px-3 py-1 rounded-sm">
                수정
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {selectedRental
                    ? `${selectedRental.semester} ${selectedRental.modelName} 내용 수정`
                    : "대여 내용 수정"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  기기 대여 내용을 수정해보세요.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div>
                <Table className="text-center border border-neutral-200">
                  <TableBody>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        대여 ID
                      </TableCell>
                      <TableCell className="text-left px-6">
                        {selectedRental?.rentalId ?? ""}
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        분류
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <DeviceCategoryCombobox
                          value={categoryName}
                          onChange={setCategoryName}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        기기명
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <Input
                          className="text-sm"
                          readOnly
                          value={selectedRental?.modelName ?? ""}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        코드번호
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <Input
                          className="text-sm"
                          value={selectedRental?.itemSerial ?? ""}
                          readOnly
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        대여 학기
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <Input
                          className="text-sm"
                          value={selectedRental?.semester ?? ""}
                          placeholder="yyyy-1"
                          readOnly
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="border-neutral-200 hover:bg-white">
                      <TableCell className="w-1/6 bg-neutral-300">
                        대여 상태
                      </TableCell>
                      <TableCell className="text-left px-4">
                        <DeviceStateCombobox />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel className="cursor-pointer">
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    toast("사용자의 해당 대여 내용이 수정되었습니다.")
                  }
                  className="hover:bg-neutral-700 font-bold cursor-pointer"
                >
                  수정
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={!selectedRental}
              className={`text-sm px-3 py-1 rounded-sm border ${selectedRental ? "hover:bg-neutral-800 cursor-pointer border-neutral-400 text-neutral-200" : "cursor-not-allowed border-neutral-700 text-neutral-600"}`}
            >
              반납
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="break-keep">
                {selectedRental
                  ? `${selectedRental.semester}) ${selectedRental.modelName}(${selectedRental.itemSerial}) 기자재를 반납 처리하시겠습니까?`
                  : "반납할 대여 기록을 선택해주세요."}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {selectedRental
                  ? "반납 처리 후 해당 대여 기록의 상태가 변경됩니다."
                  : "테이블에서 반납할 대여 기록을 선택해주세요."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReturnRental}
                disabled={!selectedRental || isReturning}
                className="bg-neutral-900 hover:bg-neutral-700 font-bold cursor-pointer"
              >
                {isReturning ? "반납 처리 중..." : "반납"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="border cursor-pointer px-3 py-1 rounded-sm hover:bg-red-400 hover:text-black border-red-400 text-sm text-red-300">
              삭제
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="break-keep">
                2025-1 아이패드 Air(A20342) 대여 기록을 삭제하시겠습니까?
              </AlertDialogTitle>
              <AlertDialogDescription>
                대여 기록은 삭제하면 다시 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  toast("사용자의 해당 대여 내용이 삭제되었습니다.")
                }
                className="bg-red-600 hover:bg-red-500 font-bold cursor-pointer"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="mt-4">
        <Table className="text-center">
          <TableHeader className="border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-white text-center">분류</TableHead>
              <TableHead className="text-white text-center">기기명</TableHead>
              <TableHead className="text-white text-center">코드번호</TableHead>
              <TableHead className="text-white text-center">
                대여 학기
              </TableHead>
              <TableHead className="text-white text-center">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="hover:bg-[#060a0c]">
            {rentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  대여 기록이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              rentals.map((rental) => (
                <TableRow key={rental.rentalId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRentalId === rental.rentalId}
                      onCheckedChange={(checked) =>
                        setSelectedRentalId(checked ? rental.rentalId : null)
                      }
                    />
                  </TableCell>
                  <TableCell>{rental.category}</TableCell>
                  <TableCell>{rental.modelName}</TableCell>
                  <TableCell>{rental.itemSerial}</TableCell>
                  <TableCell>{rental.semester}</TableCell>
                  <TableCell>
                    {rental.status === "RENTING"
                      ? "대여중"
                      : rental.status === "OVERDUE"
                        ? "미반납"
                        : "반납됨"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default User;
