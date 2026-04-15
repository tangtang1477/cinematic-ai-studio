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
  { rotate: -8, tx: 20, ty: 10 },
  { rotate: -3, tx: 6, ty: 0 },
  { rotate: 3, tx: -6, ty: 0 },
  { rotate: 8, tx: -20, ty: 10 },
];

// 4 different X origins simulating poker card positions in the video
const CARD_FLY_ORIGINS = [
  { xPercent: 28, startRotateZ: -25 },
  { xPercent: 42, startRotateZ: -10 },
  { xPercent: 58, startRotateZ: 10 },
  { xPercent: 72, startRotateZ: 25 },
];

/**
 * Preload and decode all template images before animation starts.
 */
function preloadTemplateImages(): Promise<void> {
  return Promise.all(
    templates.map((t) => {
      const img = new Image();
      img.src = t.image;
      return img.decode().catch(() => {});
    })
  ).then(() => {});
}

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("1");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [voiceover, setVoiceover] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [showPanel, setShowPanel] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [cardsSettled, setCardsSettled] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);

  const loopPlayCount = useRef(0);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const flyEndCount = useRef(0);

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
    setShowPanel(true);
  }, []);

  // Preload images when entering loop phase
  useEffect(() => {
    if (phase === "loop" && !imagesReady) {
      preloadTemplateImages().then(() => setImagesReady(true));
    }
  }, [phase, imagesReady]);

  const handleIntroEnded = useCallback(() => {
    setPhase("loop");
    loopPlayCount.current = 0;
  }, []);

  const handleLoopEnded = useCallback(() => {
    loopPlayCount.current += 1;
    if (loopPlayCount.current === 1 && imagesReady) {
      setPhase("cards-fly");
      setCardsVisible(true);
      flyEndCount.current = 0;
    }
    loopVideoRef.current?.play();
  }, [imagesReady]);

  useEffect(() => {
    if (phase === "loop" && loopVideoRef.current) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play();
    }
  }, [phase]);

  // Handle individual card flight end via animationend
  const handleCardFlyEnd = useCallback(() => {
    flyEndCount.current += 1;
    if (flyEndCount.current >= templates.length) {
      setCardsSettled(true);
      setPhase("ready");
    }
  }, []);

  // Measure panel height for dynamic offset
  const [panelHeight, setPanelHeight] = useState(0);
  useEffect(() => {
    if (showPanel && panelRef.current) {
      const h = panelRef.current.getBoundingClientRect().height;
      setPanelHeight(h);
    }
  }, [showPanel]);

  const isIntro = phase === "intro";

  // Calculate stage top: panel bottom + 64px gap when panel visible
  const stageTop = showPanel ? `${64 + panelHeight + 64}px` : "31%";

  // Calculate the final landing positions for each card (center of screen)
  // We need absolute page coordinates for the flying layer
  const totalCardsWidth = CARD_WIDTH * templates.length + CARD_OVERLAP * (templates.length - 1);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AppSidebar />
      <div className="flex-1 ml-[88px] flex flex-col h-screen overflow-hidden relative">
        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={introVideoRef}
            src="/videos/intro.mp4"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: phase === "intro" ? 1 : 0 }}
            autoPlay
            muted
            playsInline
            onEnded={handleIntroEnded}
          />
          <video
            ref={loopVideoRef}
            src="/videos/loop.mp4"
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: phase !== "intro" ? 1 : 0 }}
            muted
            playsInline
            onEnded={handleLoopEnded}
          />
        </div>

        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, rgba(113,240,246,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Input panel — fixed at top */}
          <div
            ref={panelRef}
            className="absolute inset-x-0 top-0 z-30"
            style={{
              opacity: showPanel ? 1 : 0,
              transform: showPanel ? "translateY(0)" : "translateY(-20px)",
              pointerEvents: showPanel ? "auto" : "none",
              paddingTop: "64px",
              transition: "opacity 0.45s ease-out, transform 0.45s ease-out",
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
            />
          </div>

          {/* Stage */}
          {isIntro ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <HeroSection phase={phase} />
            </div>
          ) : (
            <div
              className="absolute inset-x-0 z-10 flex flex-col items-center"
              style={{
                top: stageTop,
                transition: "top 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                pointerEvents: "none",
              }}
            >
              <HeroSection phase={phase} />

              {/* Settled/landed cards — only after flight completes */}
              <div style={{ marginTop: `${TITLE_TO_CARDS_GAP}px`, pointerEvents: "auto" }}>
                {cardsSettled ? (
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
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== FLYING CARDS LAYER ========== */}
      {/* Fixed-position overlay OUTSIDE overflow-hidden so cards fly from real top coords */}
      {cardsVisible && !cardsSettled && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            pointerEvents: "none",
            perspective: "2000px",
          }}
        >
          {templates.map((t, i) => {
            const origin = CARD_FLY_ORIGINS[i];
            const ct = CARD_FINAL_TRANSFORMS[i];
            const delay = i * 50;

            // Calculate final X position: center of content area + card offset
            const contentLeft = 88; // sidebar width
            const contentWidth = typeof window !== "undefined" ? window.innerWidth - contentLeft : 1200;
            const fanStartX = contentLeft + contentWidth / 2 - totalCardsWidth / 2;
            const finalX = fanStartX + i * (CARD_WIDTH + CARD_OVERLAP) + CARD_WIDTH / 2;

            // Final Y: approximately 55% of viewport height (center stage area)
            const finalY = typeof window !== "undefined" ? window.innerHeight * 0.55 : 500;

            // Start X: percentage of content area
            const startX = contentLeft + (contentWidth * origin.xPercent) / 100;
            const startY = typeof window !== "undefined" ? window.innerHeight * 0.1 : 80;

            return (
              <div
                key={`fly-${t.id}`}
                className="card-fly-individual"
                onAnimationEnd={handleCardFlyEnd}
                style={{
                  position: "absolute",
                  width: `${CARD_WIDTH}px`,
                  left: `${startX - CARD_WIDTH / 2}px`,
                  top: `${startY}px`,
                  zIndex: i === 1 || i === 2 ? 10 : 5,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                  animation: `cardFlyIndividual 1.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`,
                  ["--fly-dx" as string]: `${finalX - startX}px`,
                  ["--fly-dy" as string]: `${finalY - startY}px`,
                  ["--card-rotate" as string]: `${ct.rotate}deg`,
                  ["--card-tx" as string]: `${ct.tx}px`,
                  ["--card-ty" as string]: `${ct.ty}px`,
                  ["--start-rz" as string]: `${origin.startRotateZ}deg`,
                }}
              >
                <FlippableCard
                  front={<TemplateCard template={t} onTry={handleTry} />}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Index;
