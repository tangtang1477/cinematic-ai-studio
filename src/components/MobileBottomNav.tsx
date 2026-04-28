import { useState } from "react";
import { Home, Wrench, Library, User, Plus } from "lucide-react";

type NavId = "home" | "toolkit" | "assets" | "profile";

const NAV_ITEMS: { id: NavId; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "toolkit", label: "Toolkit", Icon: Wrench },
  { id: "assets", label: "My Assets", Icon: Library },
  { id: "profile", label: "Profile", Icon: User },
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
        <item.Icon size={22} className="text-foreground" strokeWidth={isActive ? 2.4 : 2} />
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