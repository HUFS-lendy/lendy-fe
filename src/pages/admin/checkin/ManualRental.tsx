import { useMemo, useState } from "react";

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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "../../../components/ui/alert-dialog";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { Search } from "lucide-react";
import { ItemCombobox } from "../../../components/ui/ItemCombobox";

import { Label } from "../../../components/ui/label";
import { useAdminUsers } from "../../../api/admin.api";
import { useModels } from "../../../api/adminModel.api";

const ManualRental = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedModelName, setSelectedModelName] = useState("");

  const [checkedRoles, setCheckedRoles] = useState({
    ADMIN: true,
    USER: true,
  });

  const [checkedStates, setCheckedStates] = useState({
    ACTIVE: true,
    BANNED: true,
  });

  const { data: modelsData } = useModels();
  const models = modelsData ?? [];

  const rolesParam = useMemo(() => {
    const roles: string[] = [];
    if (checkedRoles.ADMIN) roles.push("ADMIN");
    if (checkedRoles.USER) roles.push("USER");
    return roles.join(",");
  }, [checkedRoles]);

  const statesParam = useMemo(() => {
    const states: string[] = [];
    if (checkedStates.ACTIVE) states.push("ACTIVE");
    if (checkedStates.BANNED) states.push("BANNED");
    return states.join(",");
  }, [checkedStates]);

  const { data, isLoading, isError } = useAdminUsers({
    roles: rolesParam,
    states: statesParam,
    keyword,
    page: 0,
    size: 10,
    sort: "",
  });
  const users = data?.content ?? [];
  const selectedUser =
    users.find((user) => user.userId === selectedUserId) ?? null;

  return (
    <div className="bg-[#060a0c] w-screen px-8 text-white">
      {/* 브래드크럼 */}
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
              <BreadcrumbPage className="text-white">
                수기 대여 등록
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 제목 */}
      <div className="pt-8 pb-4">
        <div className="font-bold text-white text-3xl pb-4">수기 대여 등록</div>
      </div>
      {/* 검색창 & 수정 버튼 */}
      <div className="flex justify-between items-center pr-2">
        {/* 검색창 */}
        <div className="relative w-3/5 md:w-1/4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3 h-3 md:w-5 md:h-5" />
          <Input
            placeholder="학번 또는 이름을 입력해주세요."
            className="border-neutral-400 pl-8 md:pl-10 text-sm"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          {/* 수정 버튼 */}
          <div>
            <AlertDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  disabled={!selectedUser}
                  className={`border text-sm px-3 py-1 rounded-sm ${
                    selectedUser
                      ? "hover:bg-neutral-800 cursor-pointer border-neutral-400 text-neutral-200"
                      : "cursor-not-allowed border-neutral-700 text-neutral-600"
                  }`}
                >
                  대여 등록
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {`#${selectedUser?.userId} ${selectedUser?.username}`}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    사용자에게 기기 대여가 수동으로 부여됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div>
                  <Table className="text-center border border-neutral-200">
                    <TableBody>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          학번
                        </TableCell>
                        <TableCell className="text-left px-6">
                          {selectedUser?.studentId}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          이름
                        </TableCell>
                        <TableCell className="text-left px-6">
                          {selectedUser?.username}
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          기기
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <ItemCombobox
                            value={selectedModelName}
                            onChange={setSelectedModelName}
                            items={models.map((model: { name: string }) => ({
                              value: model.name,
                              label: model.name,
                            }))}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-neutral-200 hover:bg-white">
                        <TableCell className="w-1/6 bg-neutral-300">
                          기기 번호
                        </TableCell>
                        <TableCell className="text-left px-4">
                          <Input placeholder="기기 번호를 입력해주세요." />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogCancel className="cursor-pointer">
                    취소
                  </AlertDialogCancel>
                  <AlertDialogAction className="bg-black font-bold">
                    등록
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      {/* 권한 체크박스 */}
      <div className="flex items-center space-x-4 py-4">
        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedRoles.ADMIN}
            onCheckedChange={(checked) =>
              setCheckedRoles((prev) => ({
                ...prev,
                ADMIN: checked === true,
              }))
            }
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">관리자</p>
        </Label>

        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedRoles.USER}
            onCheckedChange={(checked) =>
              setCheckedRoles((prev) => ({
                ...prev,
                USER: checked === true,
              }))
            }
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">사용자</p>
        </Label>
      </div>

      {/* 상태 체크박스 */}
      <div className="flex items-center space-x-4 pb-4">
        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedStates.ACTIVE}
            onCheckedChange={(checked) =>
              setCheckedStates((prev) => ({
                ...prev,
                ACTIVE: checked === true,
              }))
            }
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">ACTIVE</p>
        </Label>

        <Label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={checkedStates.BANNED}
            onCheckedChange={(checked) =>
              setCheckedStates((prev) => ({
                ...prev,
                BANNED: checked === true,
              }))
            }
            className="data-[state=checked]:border-neutral-600 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-white"
          />
          <p className="text-sm">BANNED</p>
        </Label>
      </div>

      {/* 사용자 테이블 */}
      <div className="mt-4">
        <Table className="text-white text-center border border-neutral-700">
          <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
            <TableHead></TableHead>
            <TableHead className="text-white text-center">ID</TableHead>
            <TableHead className="text-white text-center">이름</TableHead>
            <TableHead className="text-white text-center">학번</TableHead>
            <TableHead className="text-white text-center">권한</TableHead>
            <TableHead className="text-white text-center">상태</TableHead>
            <TableHead className="text-white text-center">이메일</TableHead>
            <TableHead className="text-white text-center">연락처</TableHead>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center">
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-6 text-center text-red-300"
                >
                  사용자 목록을 불러오지 못했습니다.
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-6 text-center">
                  조회된 사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedUserId === user.userId}
                      onCheckedChange={(checked) => {
                        setSelectedUserId(checked ? user.userId : null);
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.userId}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.studentId}</TableCell>
                  <TableCell>
                    {user.role === "ADMIN" ? "관리자" : "사용자"}
                  </TableCell>
                  <TableCell>{user.state}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManualRental;
