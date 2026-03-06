import PillNav from "../components/PillNav";
import Logo from "../assets/cse-logo.png";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

const Header = () => {
  const { loggedIn, logout } = useAuth();

  const items = [
    { label: "홈", href: "/" },
    { label: "대여 신청", href: "/lend" },
    { label: "마이페이지", href: "/mypage" },
    { label: "유의사항", href: "/notice" },
    loggedIn
      ? {
          label: "로그아웃",
          href: "#",
          onClick: async (e?: React.MouseEvent) => {
            e?.preventDefault();
            console.log("logout");
            const { message } = await logout();
            toast(message ?? "로그아웃 되었습니다.");
            window.location.href = "/";
          },
        }
      : {
          label: "로그인",
          href: "/login",
        },
  ];

  return (
    <div className="flex justify-center">
      <PillNav
        logo={Logo}
        logoAlt="Company Logo"
        items={items}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#05090c"
        pillColor="#05090c"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#ffffff"
      />
    </div>
  );
};

export default Header;
