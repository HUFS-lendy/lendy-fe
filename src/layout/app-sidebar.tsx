import { TabletSmartphone, User, ToolCase, ChevronRight } from "lucide-react";
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
    title: "기자재",
    icon: TabletSmartphone,
    defaultOpen: true,
    children: [
      { title: "기자재 현황", url: "/admin/devices" },
      { title: "미반납 확인", url: "/admin/loans" },
    ],
  },
  {
    title: "실습키트",
    icon: ToolCase,
    children: [
      { title: "키트 현황", url: "/admin/kits" },
      { title: "미반납 확인", url: "/admin/loans" },
    ],
  },
  {
    title: "사용자 관리",
    icon: User,
    children: [
      { title: "사용자 목록", url: "/admin/users" },
      { title: "권한 설정", url: "/admin/roles" },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin</SidebarGroupLabel>
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
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
