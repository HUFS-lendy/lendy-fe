import PillNav from "../components/PillNav";
import Logo from "../assets/cse-logo.png";
const Header = () => {
  return (
    <div className="flex justify-center">
      <PillNav
        logo={Logo}
        logoAlt="Company Logo"
        items={[
          { label: "홈", href: "/" },
          { label: "대여 신청", href: "/about" },
          { label: "마이페이지", href: "/services" },
          { label: "유의사항", href: "/services" },
        ]}
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
