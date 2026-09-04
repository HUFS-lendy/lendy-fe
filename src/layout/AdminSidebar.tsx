import { useNavigate } from "react-router-dom";
import {
  TabletSmartphone,
  User,
  ToolCase,
  ChevronRight,
  Archive,
  ClipboardCheck,
  CalendarClock,
  Megaphone,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarRail,
} from "../components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";

type NavItem = {
  title: string;
  url?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  defaultOpen?: boolean;
  children?: { title: string; url: string }[];
};

// Menu items (예시)
const items: NavItem[] = [
  {
    title: "체크인",
    icon: ClipboardCheck,
    children: [
      { title: "체크인", url: "/admin/check-in" },
      { title: "수기 대여 등록", url: "/admin/manual-rental" },
      { title: "반납 처리", url: "/admin/returns" },
    ],
  },
  {
    title: "기자재",
    icon: TabletSmartphone,
    defaultOpen: true,
    children: [
      { title: "기자재 현황", url: "/admin/devices" },
      { title: "기자재 안내 관리", url: "/admin/devices/manage" },
      { title: "대여 기록 관리", url: "/admin/rental-history" },
    ],
  },
  {
    title: "실습키트",
    icon: ToolCase,
    children: [
      { title: "키트 현황", url: "/admin/kits" },
      { title: "강의 관리", url: "/admin/courses" },
      { title: "강의 운영 작업", url: "/admin/course-operations" },
    ],
  },
  {
    title: "카테고리",
    icon: Archive,
    children: [{ title: "카테고리", url: "/admin/category" }],
  },
  {
    title: "사용자 관리",
    icon: User,
    children: [
      { title: "사용자 목록", url: "/admin/users" },
      { title: "회원가입", url: "/admin/sign-up" },
    ],
  },
  {
    title: "공지사항",
    icon: Megaphone,
    children: [{ title: "공지사항 관리", url: "/admin/notices" }],
  },
  {
    title: "운영 관리",
    icon: ShieldCheck,
    children: [{ title: "운영 모니터링", url: "/admin/security-monitoring" }],
  },
  {
    title: "학기 설정",
    icon: CalendarClock,
    children: [
      { title: "학기 정보 관리", url: "/admin/view-limit" },
      { title: "예약 화면 시뮬레이션", url: "/admin/reservation-preview" },
    ],
  },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>관리자</SidebarGroupLabel>
          <SidebarGroupLabel
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            홈으로 돌아가기 &gt;
          </SidebarGroupLabel>
          <div className="border-b mx-1 my-2 border-neutral-700"></div>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.children && item.children.length > 0 ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={item.defaultOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.icon ? <item.icon /> : null}
                          <span>{item.title}</span>
                          <ChevronRight
                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                            aria-hidden="true"
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuButton asChild>
                                <a href={sub.url}>
                                  <span>{sub.title}</span>
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url || "#"}>
                        {item.icon ? <item.icon /> : null}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
