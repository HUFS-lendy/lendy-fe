import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      {!isHome && <Footer />}
    </div>
  );
};

export default Layout;
