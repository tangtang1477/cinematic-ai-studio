import iconHome from "@/assets/icon-home.svg";
import iconChannel from "@/assets/icon-channel.svg";
import iconToolkit from "@/assets/icon-toolkit.svg";
import iconAssets from "@/assets/icon-assets.svg";

const NAV_ITEMS = [
  { id: "home", icon: iconHome, label: "Home" },
  { id: "channel", icon: iconChannel, label: "Channel" },
  { id: "toolkit", icon: iconToolkit, label: "Toolkit" },
  { id: "assets", icon: iconAssets, label: "Assets" },
];

const MobileBottomNav = () => {
  const activeId = "channel";
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 8,
      }}
    >
      <div
        className="mx-auto flex items-center justify-around"
        style={{
          maxWidth: 420,
          background: "hsl(var(--foreground) / 0.1)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: 100,
          padding: "10px 8px",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              className="relative flex flex-col items-center justify-center px-3 py-1"
              aria-label={item.label}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-5 h-5"
                style={{
                  opacity: isActive ? 1 : 0.5,
                  filter: isActive ? "brightness(1.5) saturate(1.2)" : "none",
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;