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
      setFlyStage("initial");
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
    const delay = i * 90;
    const ct = cardTransforms[i];

    if (flyStage === "initial") {
      return {
        transform: `translate3d(0, -240px, 0) scale(0.08) rotateX(24deg) rotateY(180deg) rotateZ(${(i - 1.5) * 5}deg)`,
        opacity: 0,
        filter: "blur(10px)",
        width: "220px",
        marginLeft: i === 0 ? 0 : "-16px",
        zIndex: i === 1 || i === 2 ? 10 : 5,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        willChange: "transform, opacity, filter",
        transition: "none",
      };
    }

    return {
      transform: `translate3d(${ct.tx}px, ${ct.ty}px, 0) rotate(${ct.rotate}deg) scale(1) rotateX(0deg) rotateY(0deg)`,
      opacity: 1,
      filter: "blur(0px)",
      width: "220px",
      marginLeft: i === 0 ? 0 : "-16px",
      zIndex: i === 1 || i === 2 ? 10 : 5,
      transformOrigin: "bottom center",
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      willChange: "transform, opacity, filter",
      transition: `transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.65s ease-out ${delay}ms, filter 0.8s ease-out ${delay}ms`,
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
          <div
            className="absolute inset-x-0 top-0 z-20"
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

          <div className="flex-1 flex flex-col items-center justify-center" style={{ marginTop: phase === "intro" ? "0px" : "-72px" }}>
            <div>
              <HeroSection phase={phase} />
            </div>

            {showCards && (
              <div
                className="transition-all duration-300 ease-out items-center justify-center flex flex-row gap-[16px]"
                style={{ marginTop: "64px", perspective: "1600px" }}
              >
                <div className="flex items-end" style={{ transformStyle: "preserve-3d" }}>
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
