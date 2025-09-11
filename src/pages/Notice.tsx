import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const Notice = () => {
  return (
    <div className="bg-[#060a0c] w-screen h-full px-8 text-white">
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
              <BreadcrumbPage className="text-white">유의사항</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* 페이지명 */}
      <div className="pt-8 text-white">
        <div className="font-bold text-3xl pb-8">유의사항</div>
        <div>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">대여 방법</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  대여 신청은 학기 중에 이루어지며, 방학 중엔 신청이 불가합니다.
                </p>
                <p>
                  대여 신청이 완료되면, 학부 사무실(공학관 205호)에서 기기를
                  받을 수 있습니다.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">반납 방법</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>반납은 대여한 학기의 종강일까지 이루어져야 합니다.</p>
                <p>
                  종강일 이후에 미반납 상태일 경우 일주일동안 이메일로
                  경고메일이 발송되며, 이 후에는 경고 전화가 발신됩니다. 이
                  경우엔 패널티가 부여되어 대여에 제한이 생길 수 있습니다.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">불량 접수</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  마이페이지 - 대여 현황에서 대여한 기기의 불량을 접수할 수
                  있습니다.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
export default Notice;
