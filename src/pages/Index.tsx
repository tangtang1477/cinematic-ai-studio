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
  const [cardsAnimated, setCardsAnimated] = useState(false);
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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCardsAnimated(true);
        });
      });
      setTimeout(() => setPhase("ready"), 1500);
    }
    loopVideoRef.current?.play();
  }, []);

  useEffect(() => {
    if (phase === "loop" && loopVideoRef.current) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play();
    }
  }, [phase]);

  // Fan-spread card transforms (final positions)
  const cardTransforms = [
    { rotate: -8, translateX: 20, translateY: 10 },
    { rotate: -3, translateX: 6, translateY: 0 },
    { rotate: 3, translateX: -6, translateY: 0 },
    { rotate: 8, translateX: -20, translateY: 10 },
  ];

  const showCards = phase === "cards-fly" || phase === "ready";

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
          {/* CreationPanel — smooth slide in */}
          <div
            className="flex-shrink-0 transition-all duration-600 ease-out"
            style={{
              opacity: showPanel ? 1 : 0,
              transform: showPanel ? "translateY(0)" : "translateY(-20px)",
              pointerEvents: showPanel ? "auto" : "none",
              paddingTop: "64px",
              paddingBottom: "0px",
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

          {/* Hero + Cards centered area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Title area — 32px below panel when visible */}
            <div style={{ marginTop: showPanel ? "32px" : "0" }}>
              <HeroSection phase={phase} />
            </div>

            {/* Cards — 64px below title */}
            {showCards && (
              <div className="flex justify-center" style={{ marginTop: "64px" }}>
                <div className="flex items-end" style={{ perspective: "1200px" }}>
                  {templates.map((t, i) => {
                    const isAtStart = phase === "cards-fly" && !cardsAnimated;
                    const delay = i * 120;

                    return (
                      <div
                        key={t.id}
                        className="hover:!translate-y-[-20px] hover:!rotate-0 hover:z-20"
                        style={{
                          transform: isAtStart
                            ? "scale(0.3) translateY(-60vh)"
                            : `rotate(${cardTransforms[i].rotate}deg) translateX(${cardTransforms[i].translateX}px) translateY(${cardTransforms[i].translateY}px)`,
                          opacity: isAtStart ? 0 : 1,
                          transformOrigin: "bottom center",
                          width: "220px",
                          marginLeft: i === 0 ? 0 : "-16px",
                          zIndex: i === 1 || i === 2 ? 10 : 5,
                          transition: `all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`,
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
        </div>
      </div>
    </div>
  );
};

export default Index;
