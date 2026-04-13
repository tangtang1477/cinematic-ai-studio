import { useState } from "react";
import { Home, Film, Layers, FolderOpen, Plus } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "channel", icon: Film, label: "Channel" },
  { id: "toolkit", icon: Layers, label: "Toolkit" },
  { id: "assets", icon: FolderOpen, label: "Assets" },
];

const AppSidebar = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = "channel";

  return (
    <div className="fixed left-0 top-0 z-50 h-screen w-[88px]">
      {/* Logo */}
      <div className="absolute left-8 top-6 cursor-pointer">
        <span className="text-primary font-bold text-[18px]">M</span>
      </div>

      {/* Plus button */}
      <button
        className="absolute left-5 flex h-12 w-12 items-center justify-center rounded-full
          hover:brightness-90 active:brightness-75 transition-all"
        style={{
          top: "calc(50% - 162px)",
          background: "hsl(var(--foreground) / 0.1)",
        }}
      >
        <Plus size={18} className="text-foreground" />
      </button>

      {/* Nav pill */}
      <div
        className="absolute left-5 top-1/2 flex -translate-y-1/2 flex-col items-center"
        style={{
          background: "hsl(var(--foreground) / 0.1)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          width: 48,
          borderRadius: 100,
          padding: "16px 12px",
          gap: 20,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="relative flex items-center justify-center"
              style={{ width: 24, height: 24 }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {(isActive || isHovered) && (
                <div
                  className="absolute rounded-full"
                  style={{
                    width: 40,
                    height: 40,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "hsl(var(--foreground) / 0.2)",
                  }}
                />
              )}
              <button className="relative w-6 h-6 flex items-center justify-center transition-all active:scale-90">
                <Icon
                  size={20}
                  className={isActive || isHovered ? "text-primary" : "text-foreground/50"}
                />
              </button>

              {isHovered && !isActive && (
                <div
                  className="absolute flex items-center justify-center whitespace-nowrap"
                  style={{
                    left: "calc(100% + 20px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "hsl(var(--foreground) / 0.4)",
                    borderRadius: 100,
                    padding: "8px 16px",
                    pointerEvents: "none",
                  }}
                >
                  <span className="text-foreground text-[14px] leading-[14px]">
                    {item.label}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppSidebar;
