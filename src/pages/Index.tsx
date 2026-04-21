import { useState, useCallback, useRef, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import CreationPanel from "@/components/CreationPanel";
import TemplateCard from "@/components/TemplateCard";
import FlyingCardsScene from "@/components/FlyingCardsScene";
import { templates, getTemplatesByMode } from "@/data/templates";
import type { AspectRatio } from "@/components/CreationPanel";
import cardBackImg from "@/assets/card-back-sm.webp";

type Phase = "intro" | "loop" | "cards-fly" | "ready";

const CARD_WIDTH = 220;
const CARD_OVERLAP = -16;
const TITLE_TO_CARDS_GAP = 64;

const CARD_FINAL_TRANSFORMS = [
  { rotate: -12, tx: 36, ty: 18 },
  { rotate: -6, tx: 14, ty: 4 },
  { rotate: 0, tx: 0, ty: -2 },
  { rotate: 6, tx: -14, ty: 4 },
  { rotate: 12, tx: -36, ty: 18 },
];

/**
 * Preload and fully decode all template images into browser cache.
 */
const preloadedUrls = new Set<string>();

function preloadTemplateImages(): Promise<void> {
  return Promise.all(
    templates.map((t) => {
      if (preloadedUrls.has(t.image)) return Promise.resolve();
      const img = new Image();
      img.src = t.image;
      return img
        .decode()
        .then(() => {
          preloadedUrls.add(t.image);
        })
        .catch(() => {
          preloadedUrls.add(t.image);
        });
    })
  ).then(() => {});
}

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("1");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [voiceover, setVoiceover] = useState(false);
  const [mode, setMode] = useState<"story" | "audiobook">("story");
  const [voice, setVoice] = useState("warm-female");
  const [phase, setPhase] = useState<Phase>("intro");
  const [showPanel, setShowPanel] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [cardsSettled, setCardsSettled] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const [loopActuallyPlaying, setLoopActuallyPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const prevModeRef = useRef(mode);

  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);
  

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
    setMode("story");
    setShowPanel(true);
  }, []);

  const handleTryWithSelect = useCallback(
    (templateId: string) => (templatePrompt: string) => {
      handleTry(templatePrompt);
      setSelectedId((prev) => (prev === templateId ? null : templateId));
    },
    [handleTry]
  );

  // Active templates for the current mode (used by landed cards + preload layer)
  const activeTemplates = getTemplatesByMode(mode);

  // When mode changes (after first render), trigger the refresh transition.
  useEffect(() => {
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;
    setSelectedId(null);
    setIsRefreshing(true);
    const swap = setTimeout(() => {
      setRefreshKey((k) => k + 1);
      setIsRefreshing(false);
    }, 250);
    return () => clearTimeout(swap);
  }, [mode]);

  // Preload images on mount
  useEffect(() => {
    preloadTemplateImages().then(() => setImagesReady(true));
  }, []);

  // SERIAL load: intro first (gets full bandwidth), loop only after intro starts playing.
  useEffect(() => {
    introVideoRef.current?.load();
  }, []);

  // Once intro is actually playing, immediately start aggressive preload of loop.
  const handleIntroPlaying = useCallback(() => {
    const loop = loopVideoRef.current;
    if (loop && loop.preload !== "auto") {
      loop.preload = "auto";
      loop.load();
    }
  }, []);

  const handleIntroCanPlay = useCallback(() => {
    setIntroReady(true);
  }, []);

  // Cross-fade: when intro is < 1.2s from end and loop is buffered, start loop early.
  const handleIntroTimeUpdate = useCallback(() => {
    const intro = introVideoRef.current;
    const loop = loopVideoRef.current;
    if (!intro || !loop) return;
    if (phase !== "intro") return;
    const remaining = intro.duration - intro.currentTime;
    if (
      isFinite(remaining) &&
      remaining < 1.2 &&
      loop.readyState >= 3 &&
      loop.paused
    ) {
      loop.currentTime = 0;
      loop.play().catch(() => {});
      setPhase("loop");
    }
  }, [phase]);

  // Fallback: if onTimeUpdate didn't fire the early swap, ensure loop starts on intro end.
  const handleIntroEnded = useCallback(() => {
    setPhase((p) => (p === "intro" ? "loop" : p));
  }, []);

  // When loop video starts playing → mark loop active (fly-in is gated by useEffect below)
  const handleLoopPlaying = useCallback(() => {
    setLoopActuallyPlaying(true);
  }, []);

  // Ensure loop video is playing once we enter loop phase
  useEffect(() => {
    if (phase !== "intro" && loopVideoRef.current && loopVideoRef.current.paused) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play().catch(() => {});
    }
  }, [phase]);

  // Strict gate: trigger fly-in only when loop video is ACTUALLY playing AND all images decoded.
  useEffect(() => {
    if (loopActuallyPlaying && imagesReady && phase !== "cards-fly" && phase !== "ready") {
      // Extra 250ms delay so loop video fade-in finishes and the user's eyes
      // are settled on the scene before cards start flying.
      const t = setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log("[Index] triggering fly-in");
        setPhase("cards-fly");
        setCardsVisible(true);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [loopActuallyPlaying, imagesReady, phase]);

  const handleAllSettled = useCallback(() => {
    setCardsSettled(true);
    setPhase("ready");
  }, []);

  const isIntro = phase === "intro";

  // Pre-compute layout
  const contentLeft = 88;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const contentWidth = vw - contentLeft;
  const totalCardsWidth =
    CARD_WIDTH * templates.length + CARD_OVERLAP * (templates.length - 1);
  const fanStartX = contentLeft + (contentWidth - totalCardsWidth) / 2;
  const stageTopPx = vh * 0.31;
  const titleHeight = 70;
  const cardsTopY = stageTopPx + titleHeight + TITLE_TO_CARDS_GAP;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Video background — FULL SCREEN, behind everything */}
      <div className="fixed inset-0 z-0">
        <img
          src="/videos/intro-poster.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: isIntro && !introReady ? 1 : 0 }}
        />
        <video
          ref={introVideoRef}
          src="/videos/intro.mp4"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: isIntro && introReady ? 1 : 0 }}
          autoPlay
          muted
          playsInline
          preload="auto"
          poster="/videos/intro-poster.jpg"
          onLoadedData={() => setIntroReady(true)}
          onCanPlay={handleIntroCanPlay}
          onPlaying={handleIntroPlaying}
          onTimeUpdate={handleIntroTimeUpdate}
          onEnded={handleIntroEnded}
        />
        <video
          ref={loopVideoRef}
          src="/videos/loop.mp4"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: !isIntro ? 1 : 0 }}
          muted
          preload="metadata"
          playsInline
          loop
          onPlaying={handleLoopPlaying}
        />
        {/* Hidden preload layer — keeps decoded bitmaps in the live DOM so
            the flying cards hit the texture cache instantly on landing. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          {templates.map((t) => (
            <img key={t.id} src={t.image} alt="" decoding="async" loading="eager" />
          ))}
          <img src={cardBackImg} alt="" decoding="async" loading="eager" />
        </div>
      </div>

      <AppSidebar />
      <div className="flex-1 ml-[88px] flex flex-col h-screen overflow-hidden relative">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 70%, rgba(113,240,246,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Input panel — fixed at top, overlays content */}
          <div
            className="absolute inset-x-0 top-0 z-30"
            style={{
              opacity: showPanel ? 1 : 0,
              transform: showPanel ? "translateY(0)" : "translateY(-20px)",
              pointerEvents: showPanel ? "auto" : "none",
              paddingTop: "64px",
              transition:
                "opacity 0.45s ease-out, transform 0.45s ease-out",
            }}
          >
            <CreationPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              duration={duration}
              onDurationChange={setDuration}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              voiceover={voiceover}
              onVoiceoverChange={setVoiceover}
              mode={mode}
              onModeChange={setMode}
              voice={voice}
              onVoiceChange={setVoice}
            />
          </div>

          {/* Stage — FIXED position at 31% */}
          {isIntro ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <HeroSection phase={phase} />
            </div>
          ) : (
            <div
              className="absolute inset-x-0 z-10 flex flex-col items-center"
              style={{ top: "31%", pointerEvents: "none" }}
            >
              <HeroSection phase={phase} />

              {/* Landed cards */}
              <div
                style={{
                  marginTop: `${TITLE_TO_CARDS_GAP}px`,
                  pointerEvents: "auto",
                }}
              >
                {cardsSettled && (
                  <div className="flex items-end justify-center">
                    {templates.map((t, i) => {
                      const ct = CARD_FINAL_TRANSFORMS[i];
                      const isSelected = selectedId === t.id;
                      const isDimmed = selectedId !== null && !isSelected;
                      const baseTransform = `translate3d(${ct.tx}px, ${ct.ty}px, 0) rotate(${ct.rotate}deg)`;
                      const selectedTransform = `translate3d(${ct.tx}px, ${ct.ty - 20}px, 0) rotate(0deg) scale(1.05)`;
                      const dimmedTransform = `translate3d(${ct.tx}px, ${ct.ty}px, 0) rotate(${ct.rotate}deg) scale(0.96)`;
                      return (
                        <div
                          key={t.id}
                          style={{
                            width: `${CARD_WIDTH}px`,
                            marginLeft: i === 0 ? 0 : `${CARD_OVERLAP}px`,
                            zIndex: isSelected ? 30 : i === 1 || i === 2 ? 10 : 5,
                            transform: isSelected
                              ? selectedTransform
                              : isDimmed
                              ? dimmedTransform
                              : baseTransform,
                            opacity: isDimmed ? 0.5 : 1,
                            filter: isDimmed ? "saturate(0.7)" : "none",
                            borderRadius: "12px",
                            boxShadow: isSelected
                              ? "0 0 0 2px hsl(var(--primary)), 0 0 28px hsl(var(--primary) / 0.55), 0 18px 40px rgba(0,0,0,0.5)"
                              : "none",
                            transformOrigin: "bottom center",
                            transition:
                              "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), filter 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                          className="hover:!-translate-y-5 hover:!rotate-0 hover:!z-20"
                        >
                          <TemplateCard template={t} onTry={handleTryWithSelect(t.id)} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== FLYING CARDS LAYER (Framer Motion) ========== */}
      {cardsVisible && !cardsSettled && imagesReady && (
        <FlyingCardsScene
          templates={templates}
          onAllSettled={handleAllSettled}
        />
      )}
    </div>
  );
};

export default Index;
