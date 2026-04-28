import { useMemo, useState } from "react";
import { Bell, Play, Sparkles } from "lucide-react";
import { templates, templateImagesAlt } from "@/data/templates";
import MobileBottomNav from "./MobileBottomNav";
import MobileVideoPlayer, { PlayerCard } from "./MobileVideoPlayer";
import clip19 from "@/assets/clips/clip-19.gif";
import clip20 from "@/assets/clips/clip-20.gif";
import clip21 from "@/assets/clips/clip-21.gif";
import clip22 from "@/assets/clips/clip-22.gif";
import clip23 from "@/assets/clips/clip-23.mp4";
import clip24 from "@/assets/clips/clip-24.mp4";

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

const CLIPS = [clip19, clip20, clip21, clip22, clip23, clip24];

interface GridCard {
  id: string;
  image: string;
  title: string;
  category: Category;
  clip: string;
}

const MobileChannelPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Lab");
  const [activeCategory, setActiveCategory] = useState<Category>("3D");
  const [playing, setPlaying] = useState<PlayerCard | null>(null);

  // Build a richer card pool with explicit per-category buckets.
  const allCards: GridCard[] = useMemo(() => {
    const baseTemplates = templates.map((t) => ({ image: t.image, title: t.title }));
    const altTitles = ["Neon Drift", "Ghost Bloom", "Lantern Path", "Starfall", "Echo Tide"];
    const altTemplates = templateImagesAlt.map((image, i) => ({
      image,
      title: altTitles[i] ?? "Untitled",
    }));

    // Each category gets its own 5-item bucket. Reuse images where needed.
    const buckets: Record<Category, { image: string; title: string }[]> = {
      "3D": baseTemplates, // 5 items
      "Live-action": altTemplates, // 5 items
      "Image Play": [...baseTemplates.slice(0, 2), ...altTemplates.slice(0, 2)],
      Narrative: [...altTemplates.slice(2, 4), ...baseTemplates.slice(2, 4)],
      MV: [...baseTemplates.slice(1, 4)],
      Education: [...altTemplates.slice(0, 3)],
      Commercial: [...baseTemplates.slice(0, 3)],
      "2D": [...altTemplates.slice(2, 5)],
    };

    const out: GridCard[] = [];
    let clipIdx = 0;
    (Object.keys(buckets) as Category[]).forEach((cat) => {
      buckets[cat].forEach((item, i) => {
        out.push({
          id: `${cat}-${i}`,
          image: item.image,
          title: item.title,
          category: cat,
          clip: CLIPS[clipIdx++ % CLIPS.length],
        });
      });
    });
    return out;
  }, []);

  const visibleCards = allCards.filter((c) => c.category === activeCategory);

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
            <Sparkles size={18} color="#71F0F6" />
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
                fontSize: 15,
                fontWeight: 500,
                color: "#fff",
                opacity: active ? 1 : 0.5,
                transition: "opacity .2s",
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

      {/* Category chips — horizontal scroll, no scrollbar */}
      <div
        className="flex-shrink-0 overflow-x-auto no-scrollbar"
        style={{ padding: "8px 16px 12px" }}
      >
        <div className="flex items-center gap-2" style={{ width: "max-content" }}>
          {CATEGORIES.map((c) => {
            const active = c === activeCategory;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className="relative whitespace-nowrap rounded-xl active:scale-95"
                style={{
                  padding: "8px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  background: active ? "#71F0F6" : "rgba(255,255,255,0.1)",
                  color: active ? "#000" : "rgba(255,255,255,0.7)",
                  transition: "background .2s, color .2s, transform .15s",
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

      {/* 2-column card grid — no scrollbar */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ padding: "4px 16px 80px" }}
      >
        {visibleCards.length === 0 ? (
          <div
            className="w-full text-center"
            style={{ paddingTop: 48, color: "rgba(255,255,255,0.4)", fontSize: 14 }}
          >
            No templates yet
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {visibleCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setPlaying({ id: card.id, title: card.title, clip: card.clip })}
                className="relative overflow-hidden text-left active:scale-[0.98] transition-transform"
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
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{
                    width: 28,
                    height: 28,
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                  aria-hidden
                >
                  <Play size={12} fill="#fff" color="#fff" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <MobileBottomNav />

      <MobileVideoPlayer card={playing} onClose={() => setPlaying(null)} />
    </div>
  );
};

export default MobileChannelPage;
