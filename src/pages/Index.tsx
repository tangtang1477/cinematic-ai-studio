import { useState, useCallback, useRef, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import CreationPanel from "@/components/CreationPanel";
import TemplateCard from "@/components/TemplateCard";
import FlippableCard from "@/components/FlippableCard";
import { templates } from "@/data/templates";
import type { AspectRatio } from "@/components/CreationPanel";

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

const CARD_FLY_ORIGINS = [
  { xPercent: 22, startRotateZ: -28 },
  { xPercent: 36, startRotateZ: -14 },
  { xPercent: 50, startRotateZ: 0 },
  { xPercent: 64, startRotateZ: 14 },
  { xPercent: 78, startRotateZ: 28 },
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

  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);
  const flyEndCount = useRef(0);

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
    setMode("story");
    setShowPanel(true);
  }, []);

  // Preload images on mount
  useEffect(() => {
    preloadTemplateImages().then(() => setImagesReady(true));
  }, []);

  // Only load intro video upfront — defer loop.mp4 until intro is ready to play,
  // so they don't fight for bandwidth on cold cache (incognito).
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
    // No-op: fly-in is now driven by [phase, imagesReady] effect below.
  }, []);

  // Ensure loop video is playing once we enter loop phase
  useEffect(() => {
    if (phase !== "intro" && loopVideoRef.current && loopVideoRef.current.paused) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play().catch(() => {});
    }
  }, [phase]);

  // Strict gate: trigger fly-in only when loop phase reached AND all images decoded.
  useEffect(() => {
    if ((phase === "loop") && imagesReady) {
      setPhase("cards-fly");
      setCardsVisible(true);
      flyEndCount.current = 0;
    }
  }, [phase, imagesReady]);

  const handleCardFlyEnd = useCallback((e: React.AnimationEvent) => {
    if (e.animationName === "cardFlight") {
      flyEndCount.current += 1;
      if (flyEndCount.current >= templates.length) {
        setCardsSettled(true);
        setPhase("ready");
      }
    }
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
          preload="none"
          playsInline
          loop
          onPlaying={handleLoopPlaying}
        />
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
                      return (
                        <div
                          key={t.id}
                          style={{
                            width: `${CARD_WIDTH}px`,
                            marginLeft: i === 0 ? 0 : `${CARD_OVERLAP}px`,
                            zIndex: i === 1 || i === 2 ? 10 : 5,
                            transform: `translate3d(${ct.tx}px, ${ct.ty}px, 0) rotate(${ct.rotate}deg)`,
                            transformOrigin: "bottom center",
                            transition: "transform 0.3s ease-out",
                          }}
                          className="hover:!-translate-y-5 hover:!rotate-0 hover:!z-20"
                        >
                          <TemplateCard template={t} onTry={handleTry} />
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

      {/* ========== FLYING CARDS LAYER ========== */}
      {cardsVisible && !cardsSettled && imagesReady && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          {templates.map((t, i) => {
            const origin = CARD_FLY_ORIGINS[i];
            const ct = CARD_FINAL_TRANSFORMS[i];
            const delay = i * 80;

            const startX =
              contentLeft + (contentWidth * origin.xPercent) / 100;
            const startY = vh * 0.08;

            const endX =
              fanStartX +
              i * (CARD_WIDTH + CARD_OVERLAP) +
              CARD_WIDTH / 2 +
              ct.tx;
            const endY = cardsTopY + ct.ty;

            return (
              <div
                key={`fly-${t.id}`}
                onAnimationEnd={handleCardFlyEnd}
                style={{
                  position: "absolute",
                  width: `${CARD_WIDTH}px`,
                  aspectRatio: "3 / 4",
                  left: `${startX - CARD_WIDTH / 2}px`,
                  top: `${startY}px`,
                  zIndex: i === 1 || i === 2 ? 10 : 5,
                  willChange: "transform, opacity, filter",
                  perspective: "1200px",
                  animation: `cardFlight 2.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms both`,
                  ["--fly-dx" as string]: `${endX - startX}px`,
                  ["--fly-dy" as string]: `${endY - startY}px`,
                  ["--card-rotate" as string]: `${ct.rotate}deg`,
                  ["--start-rz" as string]: `${origin.startRotateZ}deg`,
                }}
              >
                {/* Inner: FlippableCard handles 3D front/back */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    animation: `cardFlip 2.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}ms both`,
                  }}
                >
                  <FlippableCard
                    front={
                      <TemplateCard
                        template={t}
                        onTry={handleTry}
                        noOverlay
                      />
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Index;
