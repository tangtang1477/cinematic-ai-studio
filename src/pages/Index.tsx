import { useState, useCallback, useRef, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import CreationPanel from "@/components/CreationPanel";
import TemplateCard from "@/components/TemplateCard";
import CardBack from "@/components/CardBack";
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

  // If images become ready after loop already played once, trigger cards immediately
  useEffect(() => {
    if (imagesReady && phase === "loop" && loopPlayCount.current >= 1) {
      setPhase("cards-fly");
      setCardsVisible(true);
      flyEndCount.current = 0;
    }
  }, [imagesReady, phase]);

  const handleIntroEnded = useCallback(() => {
    setPhase("loop");
    loopPlayCount.current = 0;
  }, []);

  const handleLoopEnded = useCallback(() => {
    loopPlayCount.current += 1;
    if (loopPlayCount.current >= 1 && imagesReady && phase === "loop") {
      setPhase("cards-fly");
      setCardsVisible(true);
      flyEndCount.current = 0;
    }
    loopVideoRef.current?.play();
  }, [imagesReady, phase]);

  useEffect(() => {
    if (phase === "loop" && loopVideoRef.current) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play();
    }
  }, [phase]);

  // Handle individual card flight end — only count outer flight animation
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

  // Pre-compute layout values for flying cards
  const contentLeft = 88;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const contentWidth = vw - contentLeft;
  const totalCardsWidth = CARD_WIDTH * templates.length + CARD_OVERLAP * (templates.length - 1);
  const fanStartX = contentLeft + (contentWidth - totalCardsWidth) / 2;
  const stageTopPx = vh * 0.31;
  const titleHeight = 70;
  const cardsTopY = stageTopPx + titleHeight + TITLE_TO_CARDS_GAP;

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Video background — FULL SCREEN, behind sidebar */}
      <div className="fixed inset-0 z-0">
        <video
          ref={introVideoRef}
          src="/videos/intro.mp4"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: isIntro ? 1 : 0 }}
          autoPlay
          muted
          playsInline
          onEnded={handleIntroEnded}
        />
        <video
          ref={loopVideoRef}
          src="/videos/loop.mp4"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: !isIntro ? 1 : 0 }}
          muted
          playsInline
          loop
          onEnded={handleLoopEnded}
        />
      </div>

      <AppSidebar />
      <div className="flex-1 ml-[88px] flex flex-col h-screen overflow-hidden relative">

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
          {/* Input panel — fixed at top, overlays content, does NOT push stage */}
          <div
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

          {/* Stage — FIXED position at 31%, never moves regardless of panel */}
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

              {/* Landed cards — only after flight completes */}
              <div style={{ marginTop: `${TITLE_TO_CARDS_GAP}px`, pointerEvents: "auto" }}>
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
      {/* Fixed-position overlay — each card flies independently from its own start to its fan endpoint */}
      {cardsVisible && !cardsSettled && (
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

            // Start: top of page, different X positions
            const startX = contentLeft + (contentWidth * origin.xPercent) / 100;
            const startY = vh * 0.08;

            // End: exact fan position matching landed cards
            const endX = fanStartX + i * (CARD_WIDTH + CARD_OVERLAP) + CARD_WIDTH / 2 + ct.tx;
            const endY = cardsTopY + ct.ty;

            return (
              <div
                key={`fly-${t.id}`}
                onAnimationEnd={handleCardFlyEnd}
                style={{
                  position: "absolute",
                  width: `${CARD_WIDTH}px`,
                  left: `${startX - CARD_WIDTH / 2}px`,
                  top: `${startY}px`,
                  zIndex: i === 1 || i === 2 ? 10 : 5,
                  willChange: "transform, opacity, filter",
                  perspective: "1200px",
                  // Outer: flight path (translate + scale + blur + opacity)
                  animation: `cardFlight 2.4s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms both`,
                  ["--fly-dx" as string]: `${endX - startX}px`,
                  ["--fly-dy" as string]: `${endY - startY}px`,
                  ["--card-rotate" as string]: `${ct.rotate}deg`,
                  ["--start-rz" as string]: `${origin.startRotateZ}deg`,
                }}
              >
                {/* Inner: 3D flip (rotateY 180 → 0, back → front) */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "3 / 4",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    animation: `cardFlip 2.4s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms both`,
                  }}
                >
                  {/* Front face */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <TemplateCard template={t} onTry={handleTry} />
                  </div>
                  {/* Back face */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <CardBack />
                  </div>
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
