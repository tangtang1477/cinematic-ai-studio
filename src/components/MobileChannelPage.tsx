import { useState } from "react";
import { Bell, Play, Coins } from "lucide-react";
import { templates, templateImagesAlt } from "@/data/templates";
import MobileBottomNav from "./MobileBottomNav";

const TABS = ["For You", "Lab", "AIdeo World", "Fun"] as const;
type Tab = (typeof TABS)[number];

const CATEGORIES = [
  "3D",
  "Live-action",
  "Image Play",
  "Narrative",
  "MV",
  "Education",
  "Commercial",
  "2D",
] as const;
type Category = (typeof CATEGORIES)[number];

const MobileChannelPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Lab");
  const [activeCategory, setActiveCategory] = useState<Category>("3D");

  // Build an 8-card grid from existing template assets.
  const gridImages = [
    ...templates.map((t) => ({ id: t.id, image: t.image, title: t.title })),
    ...templateImagesAlt.slice(0, 3).map((image, i) => ({
      id: `alt-${i}`,
      image,
      title: "Untitled",
    })),
  ].slice(0, 8);

  return (
    <div
      className="md:hidden fixed inset-0 flex flex-col"
      style={{ background: "#000", color: "#fff", fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{ height: 48, padding: "0 16px" }}
      >
        <span style={{ color: "#71F0F6", fontSize: 18, fontWeight: 700 }}>
          MovieFlow
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Coins size={18} color="#71F0F6" />
            <span style={{ fontSize: 14, fontWeight: 700 }}>320</span>
          </div>
          <button aria-label="Notifications">
            <Bell size={20} color="#fff" />
          </button>
        </div>
      </div>

      {/* Top tabs */}
      <div
        className="flex items-end gap-5 flex-shrink-0 relative"
        style={{ padding: "4px 16px 8px" }}
      >
        {TABS.map((t) => {
          const active = t === activeTab;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className="relative pb-1.5"
              style={{
                fontSize: active ? 18 : 15,
                fontWeight: active ? 600 : 400,
                color: "#fff",
                opacity: active ? 1 : 0.5,
                transition: "opacity .2s, font-size .2s",
              }}
            >
              {t}
              {active && (
                <>
                  <span
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      bottom: 0,
                      width: 24,
                      height: 3,
                      borderRadius: 2,
                      background: "#71F0F6",
                    }}
                  />
                  <span
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{
                      bottom: -4,
                      width: 32,
                      height: 8,
                      borderRadius: 8,
                      background: "#71F0F6",
                      filter: "blur(8px)",
                      opacity: 0.8,
                    }}
                  />
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Category chips — horizontal scroll */}
      <div
        className="flex-shrink-0 overflow-x-auto"
        style={{ padding: "8px 16px 12px", scrollbarWidth: "none" }}
      >
        <div className="flex items-center gap-2" style={{ width: "max-content" }}>
          {CATEGORIES.map((c) => {
            const active = c === activeCategory;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className="relative whitespace-nowrap rounded-xl"
                style={{
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  background: active ? "#71F0F6" : "rgba(255,255,255,0.1)",
                  color: active ? "#000" : "rgba(255,255,255,0.7)",
                  transition: "background .2s, color .2s",
                }}
              >
                {active && (
                  <span
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                      background: "#71F0F6",
                      filter: "blur(10px)",
                      opacity: 0.6,
                      zIndex: -1,
                    }}
                  />
                )}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-column card grid */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "4px 16px 80px" }}
      >
        <div className="grid grid-cols-2 gap-3">
          {gridImages.map((card) => (
            <div
              key={card.id}
              className="relative overflow-hidden"
              style={{
                aspectRatio: "3/4",
                borderRadius: 16,
                background: "#111",
              }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <button
                onClick={() => {
                  // eslint-disable-next-line no-console
                  console.log("[MobileChannel] play", card.id);
                }}
                className="absolute flex items-center justify-center rounded-full active:scale-95 transition-transform"
                style={{
                  width: 28,
                  height: 28,
                  top: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
                aria-label="Play"
              >
                <Play size={12} fill="#fff" color="#fff" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileChannelPage;