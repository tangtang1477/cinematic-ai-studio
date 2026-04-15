import { useState, useCallback, useRef, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import CreationPanel from "@/components/CreationPanel";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import type { AspectRatio } from "@/components/CreationPanel";

type Phase = "intro" | "loop" | "cards-fly" | "ready";
type FlyStage = "hidden" | "flying" | "landed" | "done";

const CARD_FINAL_TRANSFORMS = [
  { rotate: -8, tx: 20, ty: 10 },
  { rotate: -3, tx: 6, ty: 0 },
  { rotate: 3, tx: -6, ty: 0 },
  { rotate: 8, tx: -20, ty: 10 },
];

// The top position (in vh) where the input box / poker cards area is
const FLY_ORIGIN_TOP_VH = 12;
// The final resting position (in vh) for the card fan center
const FLY_DEST_TOP_VH = 52;

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("1");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [voiceover, setVoiceover] = useState(false);

  const [phase, setPhase] = useState<Phase>("intro");
  const [showPanel, setShowPanel] = useState(false);
  const [flyStage, setFlyStage] = useState<FlyStage>("hidden");
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
      // Stage 1: render flying cards at origin (tiny, invisible)
      setFlyStage("flying");
      // Stage 2: trigger flight transition after paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyStage("landed");
        });
      });
      // Stage 3: after animation completes, switch to static landed layer
      setTimeout(() => {
        setFlyStage("done");
        setPhase("ready");
      }, 1600);
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
  const showFlyingLayer = flyStage === "flying" || flyStage === "landed";
  const showLandedLayer = flyStage === "done";

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AppSidebar />
      <div className="flex-1 ml-[88px] flex flex-col h-screen overflow-hidden relative">
        {/* Video background layer */}
        <div className="absolute inset-0 z-0">
          <video
            ref={introVideoRef}
            src="/videos/intro.mp4"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: phase === "intro" ? 1 : 0 }}
            autoPlay
            muted
            playsInline
            onEnded={handleIntroEnded}
          />
          <video
            ref={loopVideoRef}
            src="/videos/loop.mp4"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: phase !== "intro" ? 1 : 0 }}
            muted
            playsInline
            onEnded={handleLoopEnded}
          />
        </div>

        {/* 3D ambient background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, rgba(113,240,246,0.06) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Input panel - absolute positioned at top */}
          <div
            className="absolute inset-x-0 top-0 z-20"
            style={{
              opacity: showPanel ? 1 : 0,
              transform: showPanel ? "translateY(0)" : "translateY(-20px)",
              pointerEvents: showPanel ? "auto" : "none",
              paddingTop: "64px",
              transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
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

          {/* Stage area */}
          {isIntro ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <HeroSection phase={phase} />
            </div>
          ) : (
            /* Post-intro: title + cards in a fixed stage, positioned below input box */
            <div
              className="absolute inset-x-0 flex flex-col items-center"
              style={{
                top: "45%",
                transform: "translateY(-50%)",
              }}
            >
              <HeroSection phase={phase} />

              {/* Landed (static) card layer - only after animation completes */}
              {showLandedLayer && (
                <div style={{ marginTop: "64px" }}>
                  <div className="flex items-end justify-center">
                    {templates.map((t, i) => {
                      const ct = CARD_FINAL_TRANSFORMS[i];
                      return (
                        <div
                          key={t.id}
                          className="hover:!translate-y-[-20px] hover:!rotate-0 hover:z-20"
                          style={{
                            transform: `translate3d(${ct.tx}px, ${ct.ty}px, 0) rotate(${ct.rotate}deg)`,
                            width: "220px",
                            marginLeft: i === 0 ? 0 : "-16px",
                            zIndex: i === 1 || i === 2 ? 10 : 5,
                            transformOrigin: "bottom center",
                            transition: "transform 0.3s ease-out",
                          }}
                        >
                          <TemplateCard template={t} onTry={handleTry} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================
              FLYING LAYER — completely separate from stage.
              Absolute positioned in the full page.
              Origin: top of page (input box / poker area).
              Destination: center of page (card fan area).
              ============================================ */}
          {showFlyingLayer && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                // Animate from origin top to destination top
                top: flyStage === "flying" ? `${FLY_ORIGIN_TOP_VH}vh` : `${FLY_DEST_TOP_VH}vh`,
                transform: "translateX(-50%) translateY(-50%)",
                transition: flyStage === "landed"
                  ? "top 1.2s cubic-bezier(0.22, 1, 0.36, 1)"
                  : "none",
                zIndex: 30,
                perspective: "1600px",
                transformStyle: "preserve-3d",
                pointerEvents: "none",
              }}
            >
              <div
                className="flex items-end justify-center"
                style={{ transformStyle: "preserve-3d" }}
              >
                {templates.map((t, i) => {
                  const ct = CARD_FINAL_TRANSFORMS[i];
                  const delay = i * 60;

                  const style: React.CSSProperties =
                    flyStage === "flying"
                      ? {
                          // Origin: tiny, flipped, blurred, transparent
                          transform: `scale(0.08) rotateY(180deg) rotateX(15deg) rotateZ(${(i - 1.5) * 5}deg)`,
                          opacity: 0,
                          filter: "blur(8px)",
                          width: "220px",
                          marginLeft: i === 0 ? 0 : "-16px",
                          zIndex: i === 1 || i === 2 ? 10 : 5,
                          transformOrigin: "center center",
                          backfaceVisibility: "hidden",
                          willChange: "transform, opacity, filter",
                          transition: "none",
                        }
                      : {
                          // Destination: full size, fan spread, clear
                          transform: `translate3d(${ct.tx}px, ${ct.ty}px, 0) rotate(${ct.rotate}deg) scale(1) rotateY(0deg) rotateX(0deg)`,
                          opacity: 1,
                          filter: "blur(0px)",
                          width: "220px",
                          marginLeft: i === 0 ? 0 : "-16px",
                          zIndex: i === 1 || i === 2 ? 10 : 5,
                          transformOrigin: "bottom center",
                          backfaceVisibility: "hidden",
                          willChange: "transform, opacity, filter",
                          transition: `transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.5s ease-out ${delay}ms, filter 0.6s ease-out ${delay}ms`,
                        };

                  return (
                    <div key={t.id} style={style}>
                      <TemplateCard template={t} onTry={handleTry} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
