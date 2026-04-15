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
  const [flyStage, setFlyStage] = useState<"hidden" | "initial" | "landed">("hidden");
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
      // Step 1: render cards at initial position (small, blurred, at video card area)
      setFlyStage("initial");
      // Step 2: after a frame, trigger fly-in to final position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyStage("landed");
        });
      });
      // Step 3: mark ready after animation completes
      setTimeout(() => setPhase("ready"), 1200);
    }
    loopVideoRef.current?.play();
  }, []);

  useEffect(() => {
    if (phase === "loop" && loopVideoRef.current) {
      loopVideoRef.current.currentTime = 0;
      loopVideoRef.current.play();
    }
  }, [phase]);

  // Fan-spread final positions
  const cardTransforms = [
    { rotate: -8, tx: 20, ty: 10 },
    { rotate: -3, tx: 6, ty: 0 },
    { rotate: 3, tx: -6, ty: 0 },
    { rotate: 8, tx: -20, ty: 10 },
  ];

  const showCards = flyStage !== "hidden";

  // Card style based on fly stage
  const getCardStyle = (i: number) => {
    const delay = i * 100;
    const ct = cardTransforms[i];

    if (flyStage === "initial") {
      return {
        transform: "translate3d(0, -50vh, 0) scale(0.1)",
        opacity: 0,
        filter: "blur(8px)",
        width: "220px",
        marginLeft: i === 0 ? 0 : "-16px",
        zIndex: i === 1 || i === 2 ? 10 : 5,
        transformOrigin: "center center",
        transition: "none",
      };
    }

    // Landed: final fan position
    return {
      transform: `translate3d(${ct.tx}px, ${ct.ty}px, 0) rotate(${ct.rotate}deg) scale(1)`,
      opacity: 1,
      filter: "blur(0px)",
      width: "220px",
      marginLeft: i === 0 ? 0 : "-16px",
      zIndex: i === 1 || i === 2 ? 10 : 5,
      transformOrigin: "bottom center",
      transition: `transform 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.6s ease-out ${delay}ms, filter 0.7s ease-out ${delay}ms`,
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
          {/* CreationPanel — smooth slide in */}
          <div
            className="flex-shrink-0"
            style={{
              opacity: showPanel ? 1 : 0,
              transform: showPanel ? "translateY(0)" : "translateY(-20px)",
              pointerEvents: showPanel ? "auto" : "none",
              paddingTop: "64px",
              paddingBottom: "0px",
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

          {/* Hero + Cards centered area */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Title — always visible, 32px below panel when visible */}
            <div style={{ marginTop: showPanel ? "64px" : "0" }}>
              <HeroSection phase={phase} showPanel={showPanel} />
            </div>

            {/* Cards — 64px below title */}
            {showCards && (
              <div className="flex justify-center" style={{ marginTop: "64px", perspective: "1200px" }}>
                <div className="flex items-end">
                  {templates.map((t, i) => (
                    <div
                      key={t.id}
                      className="hover:!translate-y-[-20px] hover:!rotate-0 hover:z-20"
                      style={getCardStyle(i) as React.CSSProperties}
                    >
                      <TemplateCard template={t} onTry={handleTry} />
                    </div>
                  ))}
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
