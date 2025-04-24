// link (next js)
import Link from "next/link";

// next hooks
import { usePathname } from "next/navigation";

// framer motion
import { motion } from "framer-motion";

const links = [
  { path: "/", name: "Giới Thiệu" },
  { path: "/projects", name: "Sản Phẩm" },
  { path: "/nhuongquyen", name: "Nhượng Quyền" },
  { path: "/news", name: "Tin Tức" },
  { path: "/lienhe", name: "Liên Hệ" },
];

const Nav = ({ containerStyles, linkStyles, underlineStyles, isMobile, onLinkClick }) => {
  const path = usePathname();
  
  const handleClick = () => {
    // Only call onLinkClick if it exists and we're in mobile view
    if (isMobile && onLinkClick) {
      onLinkClick();
    }
  };
  
  return (
    <nav className={`${containerStyles}`}>
      {links.map((link, index) => {
        return (
          <Link
            href={link.path}
            key={index}
            className={`capitalize ${linkStyles}`}
            onClick={handleClick}
          >
            {link.path === path && (
              <motion.span
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                transition={{ type: "tween" }}
                layoutId="underline"
                className={`${underlineStyles}`}
              />
            )}
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;