import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { Toaster } from "../components/ui/sonner";

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isLogin = location.pathname === "/login";

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
