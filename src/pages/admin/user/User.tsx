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
import { Checkbox } from "../../../components/ui/checkbox";
import { toast } from "sonner";
import { useFetchUser } from "../../../api/admin.api";
import { useUserRentals } from "../../../api/adminUser.api";
import { useReturnReservation } from "../../../api/adminRental.api";

const User = () => {
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

  const canReturn = !!selectedRental && selectedRental.status !== "RETURNED";

  const handleReturnRental = () => {
    if (!selectedRental || !canReturn || isReturning) {
      toast("반납할 대여 기록을 선택해주세요.");
      return;
    }

    returnReservation(
      { rentalId: selectedRental.rentalId },
      {
        onSuccess: () => {
          setSelectedRentalId(null);
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

      <p className="py-3 text-sm text-neutral-400">대여 기록은 이력 보존을 위해 수정·삭제하지 않습니다. 현재 대여 중인 기자재만 반납 처리할 수 있습니다.</p>
      <div className="flex space-x-4 justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={!canReturn || isReturning}
              className={`text-sm px-3 py-1 rounded-sm border ${canReturn ? "hover:bg-neutral-800 cursor-pointer border-neutral-400 text-neutral-200" : "cursor-not-allowed border-neutral-700 text-neutral-600"}`}
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
                disabled={!canReturn || isReturning}
                className="bg-neutral-900 hover:bg-neutral-700 font-bold cursor-pointer"
              >
                {isReturning ? "반납 처리 중..." : "반납"}
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
