import { useState, useCallback, useRef, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import CreationPanel from "@/components/CreationPanel";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import type { AspectRatio } from "@/components/CreationPanel";

type Phase = "intro" | "loop" | "cards-fly" | "ready";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("1");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [voiceover, setVoiceover] = useState(false);

  const [phase, setPhase] = useState<Phase>("intro");
  const [showPanel, setShowPanel] = useState(false);
  const [flyStage, setFlyStage] = useState<"hidden" | "flying" | "landed">("hidden");
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
      // Stage 1: render cards at origin (invisible, tiny)
      setFlyStage("flying");
      // Stage 2: after a frame, trigger the flight transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyStage("landed");
        });
      });
      setTimeout(() => setPhase("ready"), 1400);
    }
    loopVideoRef.current?.play();
  }, []);

  useEffect(() => {
    if (phase === "loop" && loopVideoRef.current) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play();
    }
  }, [phase]);

  // Fan-spread final positions (relative to the card container center)
  const cardFinalTransforms = [
    { rotate: -8, tx: 20, ty: 10 },
    { rotate: -3, tx: 6, ty: 0 },
    { rotate: 3, tx: -6, ty: 0 },
    { rotate: 8, tx: -20, ty: 10 },
  ];

  const showCards = flyStage !== "hidden";
  const isIntro = phase === "intro";

  // The cards fly from the top of the page (where the input box / poker cards are)
  // to their final fan position. We use absolute positioning for the entire card layer.
  // Origin: top ~15% of viewport. Destination: center of the stage.
  // The "flying" state = at origin (tiny, flipped, blurred).
  // The "landed" state = at destination (full size, no flip, clear).

  const getCardStyle = (i: number): React.CSSProperties => {
    const delay = i * 80;
    const ct = cardFinalTransforms[i];

    if (flyStage === "flying") {
      // Origin state: at top, tiny, flipped, invisible
      return {
        transform: `scale(0.08) rotateY(180deg) rotateX(20deg) rotateZ(${(i - 1.5) * 8}deg)`,
        opacity: 0,
        filter: "blur(12px)",
        width: "220px",
        marginLeft: i === 0 ? 0 : "-16px",
        zIndex: i === 1 || i === 2 ? 10 : 5,
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
        willChange: "transform, opacity, filter",
        transition: "none",
      };
    }

    // Landed state: final fan position
    return {
      transform: `translate3d(${ct.tx}px, ${ct.ty}px, 0) rotate(${ct.rotate}deg) scale(1) rotateY(0deg) rotateX(0deg)`,
      opacity: 1,
      filter: "blur(0px)",
      width: "220px",
      marginLeft: i === 0 ? 0 : "-16px",
      zIndex: i === 1 || i === 2 ? 10 : 5,
      transformOrigin: "bottom center",
      backfaceVisibility: "hidden",
      willChange: "transform, opacity, filter",
      transition: `transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.6s ease-out ${delay}ms, filter 0.7s ease-out ${delay}ms`,
    };
  };

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
          {/* Input panel - absolute positioned at top, never affects layout below */}
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

          {/* Stage area - absolute positioned, anchored to fixed coordinates */}
          {isIntro ? (
            /* Intro: title centered with large padding */
            <div className="flex-1 flex flex-col items-center justify-center">
              <HeroSection phase={phase} />
            </div>
          ) : (
            /* Post-intro: title + cards in a fixed "stage" area */
            <div
              className="absolute inset-x-0 flex flex-col items-center"
              style={{
                top: "38%",
                transform: "translateY(-50%)",
                perspective: "1600px",
              }}
            >
              <HeroSection phase={phase} />

              {/* Card fly-in layer - absolutely positioned relative to stage */}
              {showCards && (
                <div
                  style={{
                    marginTop: "64px",
                    position: "relative",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* 
                    The card container itself moves from top to center.
                    In "flying" state: translated up to the input box area.
                    In "landed" state: at its natural position (0,0).
                  */}
                  <div
                    className="flex items-end justify-center"
                    style={{
                      transform: flyStage === "flying"
                        ? "translateY(-45vh)"
                        : "translateY(0)",
                      transition: flyStage === "landed"
                        ? "transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)"
                        : "none",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {templates.map((t, i) => (
                      <div
                        key={t.id}
                        className="hover:!translate-y-[-20px] hover:!rotate-0 hover:z-20"
                        style={getCardStyle(i)}
                      >
                        <TemplateCard template={t} onTry={handleTry} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
