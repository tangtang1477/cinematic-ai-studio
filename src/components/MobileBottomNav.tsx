import { useState } from "react";
import { Plus } from "lucide-react";
import iconHome from "@/assets/nav/home.svg";
import iconToolkit from "@/assets/nav/toolkit.svg";
import iconAssets from "@/assets/nav/assets.svg";
import iconProfile from "@/assets/nav/profile.svg";

type NavId = "home" | "toolkit" | "assets" | "profile";

const NAV_ITEMS: { id: NavId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: iconHome },
  { id: "toolkit", label: "Toolkit", icon: iconToolkit },
  { id: "assets", label: "My Assets", icon: iconAssets },
  { id: "profile", label: "Profile", icon: iconProfile },
];

const MobileBottomNav = ({ onCreateClick }: { onCreateClick?: () => void }) => {
  const [active, setActive] = useState<NavId>("home");

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => {
    const isActive = active === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActive(item.id)}
        className="flex flex-1 flex-col items-center justify-center"
        style={{ gap: 2, opacity: isActive ? 1 : 0.5 }}
        aria-label={item.label}
      >
        <img
          src={item.icon}
          alt=""
          aria-hidden
          style={{ width: 24, height: 24 }}
        />
        <span className="text-foreground" style={{ fontSize: 11, lineHeight: "14px" }}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "#000",
        borderTop: "1px solid rgba(255,255,255,0.2)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        className="relative flex items-stretch w-full"
        style={{ height: 56 }}
      >
        {renderItem(NAV_ITEMS[0])}
        {renderItem(NAV_ITEMS[1])}

        {/* Center create slot — keeps grid balanced */}
        <div className="flex flex-1 items-center justify-center relative">
          <button
            onClick={onCreateClick}
            className="absolute flex items-center justify-center rounded-full active:scale-95 transition-transform"
            style={{
              width: 56,
              height: 56,
              top: -22,
              background: "#FFFFFF",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
            aria-label="Create"
          >
            <Plus size={26} strokeWidth={2.4} color="#000" />
          </button>
        </div>

        {renderItem(NAV_ITEMS[2])}
        {renderItem(NAV_ITEMS[3])}
      </div>
    </div>
  );
};

export default MobileBottomNav;