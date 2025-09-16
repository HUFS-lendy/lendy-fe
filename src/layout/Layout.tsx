import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "../components/ui/sonner";

// shadcn sidebar
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/ui/app-sidebar";

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login";
  const isAdmin = location.pathname.startsWith("/admin"); // /admin 하위 전부

  // --- Admin 전용 레이아웃 ---
  if (isAdmin) {
    return (
      <SidebarProvider>
        <div className="flex bg-[#060a0c] text-white h-screen w-screen overflow-hidden py-1">
          <AppSidebar />
          <main className="h-full overflow-y-auto">
            <SidebarTrigger />
            <Outlet />
          </main>
        </div>
        <Toaster position="top-right" duration={2500} />
      </SidebarProvider>
    );
  }

  // --- 기본(사용자) 레이아웃 ---
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      {!isHome && !isLogin && <Footer />}
      <Toaster position="top-right" duration={2500} />
    </div>
  );
};

export default Layout;
