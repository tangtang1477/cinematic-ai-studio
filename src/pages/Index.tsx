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

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("1");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [voiceover, setVoiceover] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [showPanel, setShowPanel] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [cardsSettled, setCardsSettled] = useState(false);

  const loopPlayCount = useRef(0);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
    setShowPanel(true);
  }, []);

  const handleIntroEnded = useCallback(() => {
    setPhase("loop");
    loopPlayCount.current = 0;
  }, []);

  const handleLoopEnded = useCallback(() => {
    loopPlayCount.current += 1;
    if (loopPlayCount.current === 1) {
      setPhase("cards-fly");
      setCardsVisible(true);
      setTimeout(() => {
        setCardsSettled(true);
        setPhase("ready");
      }, 1800);
    }
    loopVideoRef.current?.play();
  }, []);

  useEffect(() => {
    if (phase === "loop" && loopVideoRef.current) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play();
    }
  }, [phase]);

  const isIntro = phase === "intro";

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
                top: showPanel ? "240px" : "31%",
                transition: "top 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
                pointerEvents: "none",
              }}
            >
              <HeroSection phase={phase} />

              {/* Settled cards — only after flight completes */}
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
      {/* Fixed-position overlay OUTSIDE overflow-hidden container so cards can fly from top */}
      {cardsVisible && !cardsSettled && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            pointerEvents: "none",
            perspective: "1800px",
          }}
        >
          {/* Container that flies from top to center */}
          <div
            className="fly-container"
            style={{
              position: "absolute",
              left: "calc(88px + 50%)",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              animation: "flyContainerIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) both",
              willChange: "top, opacity",
            }}
          >
            {templates.map((t, i) => {
              const ct = CARD_FINAL_TRANSFORMS[i];
              const delay = i * 80;
              return (
                <div
                  key={`fly-${t.id}`}
                  style={{
                    width: `${CARD_WIDTH}px`,
                    marginLeft: i === 0 ? 0 : `${CARD_OVERLAP}px`,
                    zIndex: i === 1 || i === 2 ? 10 : 5,
                    animation: `cardFlyIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity, filter",
                    ["--card-rotate" as string]: `${ct.rotate}deg`,
                    ["--card-tx" as string]: `${ct.tx}px`,
                    ["--card-ty" as string]: `${ct.ty}px`,
                  }}
                >
                  <FlippableCard
                    front={<TemplateCard template={t} onTry={handleTry} />}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
