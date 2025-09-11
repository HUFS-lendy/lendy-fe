import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
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
} from "../components/ui/alert-dialog";
import { toast } from "sonner";

const Lend = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#060a0c] w-screen h-full px-8">
      {/* 브래드크럼 */}
      <div className="pt-20">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-white hover:text-gray-100"
                href="/"
              >
                홈
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">대여 신청</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-8">
        <div className="font-bold text-white text-3xl pb-8">
          기자재 / 키트 대여 신청
        </div>
        <Tabs defaultValue="기자재">
          {/* 탭 */}
          <TabsList className="bg-[#1e2427]">
            <TabsTrigger className="text-white bg-[#1e2427]" value="기자재">
              기자재
            </TabsTrigger>
            <TabsTrigger className="text-white bg-[#1e2427]" value="실습 키트">
              실습 키트
            </TabsTrigger>
          </TabsList>
          {/* 기자재 콘텐츠 */}
          <TabsContent value="기자재">
            <div className="mt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="flex justify-end mb-4">
                    <div className="bg-[#060a0c] hover:bg-neutral-700 cursor-pointer text-sm text-white border border-neutral-400 rounded-md px-3 py-1">
                      대여
                    </div>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="pb-4">
                      기자재 - 아이패드 Air을 대여하시겠습니까?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="break-keep">
                      반납 기한은 해당{" "}
                      <span className="font-bold">학기 종강일</span>까지이며,{" "}
                      <span className="text-red-500">
                        기한 내 미반납 시 일주일 간 이메일로 경고 메일이
                        발송되며 대여 서비스 내 패널티가 부여
                      </span>
                      될 수 있습니다.
                      <br />
                      <br />
                      ※ 대리 제출 및 수령 불가합니다.
                      <br /> ※ 노트북과 아이패드 중복 대여가 불가합니다.
                      <br />
                      ※ 타학과와 휴학생은 대여 불가합니다. <br />※ 방학 중 대여
                      및 연장 불가 합니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer"
                      onClick={() => {
                        toast("대여 신청이 완료되었습니다.");
                        navigate("/lending-state");
                      }}
                    >
                      대여
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Table className="text-white text-center border border-neutral-700">
                <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
                  <TableHead></TableHead>
                  <TableHead className="text-white text-center">분류</TableHead>
                  <TableHead className="text-white text-center">
                    기자재명
                  </TableHead>
                  <TableHead className="text-white text-center">
                    잔여 대수
                  </TableHead>
                </TableHeader>
                <TableBody className="cursor-pointer">
                  <TableRow>
                    <TableCell>
                      <Checkbox className="border-neutral-400" />
                    </TableCell>
                    <TableCell>태블릿</TableCell>
                    <TableCell>아이패드 Air</TableCell>
                    <TableCell>10</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Checkbox className="border-neutral-400" />
                    </TableCell>
                    <TableCell>노트북</TableCell>
                    <TableCell>삼성 노트북</TableCell>
                    <TableCell>10</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          {/* 실습키트 콘텐츠 */}
          <TabsContent value="실습 키트">
            <TabsContent value="실습 키트">
              <div className="mt-4">
                <div className="flex justify-end mb-4">
                  <div className="bg-[#060a0c] hover:bg-neutral-700 cursor-pointer text-sm text-white border border-neutral-400 rounded-md px-3 py-1">
                    대여
                  </div>
                </div>
                <Table className="text-white text-center border border-neutral-700">
                  <TableHeader className="text-center border-b bg-[#11141b] hover:bg-[#11141b] border-neutral-700">
                    <TableHead></TableHead>
                    <TableHead className="text-white text-center">
                      키트명
                    </TableHead>
                    <TableHead className="text-white text-center">
                      사용 수업명
                    </TableHead>
                    <TableHead className="text-white text-center">
                      잔여 대수
                    </TableHead>
                  </TableHeader>
                  <TableBody className="cursor-pointer">
                    <TableRow>
                      <TableCell>
                        <Checkbox className="border-neutral-400" />
                      </TableCell>
                      <TableCell>Cortex-M3</TableCell>
                      <TableCell>마이크로프로세서 및 실습</TableCell>
                      <TableCell>20</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Checkbox className="border-neutral-400" />
                      </TableCell>
                      <TableCell>아두이노</TableCell>
                      <TableCell>컴퓨터시스템입문</TableCell>
                      <TableCell>60</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Lend;
