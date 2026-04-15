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

  // Handle intro video ended
  const handleIntroEnded = useCallback(() => {
    setPhase("loop");
    loopPlayCount.current = 0;
  }, []);

  // Handle loop video ended (first time → cards fly)
  const handleLoopEnded = useCallback(() => {
    loopPlayCount.current += 1;
    if (loopPlayCount.current === 1) {
      setPhase("cards-fly");
      // Trigger animation after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCardsAnimated(true);
        });
      });
      setTimeout(() => setPhase("ready"), 1500);
    }
    loopVideoRef.current?.play();
  }, []);

  // Start loop video when phase changes to loop
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
          {/* Intro video */}
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
          {/* Loop video */}
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

        {/* 3D ambient background (behind content, above video) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, rgba(113,240,246,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute w-[300px] h-[300px] rounded-full animate-float-orb"
            style={{
              top: "30%",
              left: "10%",
              background: "radial-gradient(circle, rgba(113,240,246,0.04) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute w-[200px] h-[200px] rounded-full animate-float-orb-delayed"
            style={{
              top: "50%",
              right: "15%",
              background: "radial-gradient(circle, rgba(113,240,246,0.05) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute w-[150px] h-[150px] rounded-full animate-float-orb-slow"
            style={{
              bottom: "20%",
              left: "40%",
              background: "radial-gradient(circle, rgba(113,240,246,0.03) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Fixed top: Creation Panel — slides in when showPanel is true */}
        <div
          className="flex-shrink-0 relative z-10 transition-all duration-500 ease-out"
          style={{
            transform: showPanel ? "translateY(0)" : "translateY(-100%)",
            opacity: showPanel ? 1 : 0,
            maxHeight: showPanel ? "200px" : "0px",
            overflow: "hidden",
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar relative z-10 flex flex-col">
          {/* Hero — visible during intro and loop, fades out after */}
          <HeroSection phase={phase} />

          {/* Fan-spread card layout — appears during cards-fly / ready */}
          {showCards && (
            <div className="flex justify-center items-end py-8 px-6 flex-1">
              <div className="flex items-end" style={{ perspective: "1200px" }}>
                {templates.map((t, i) => {
                  const isAtStart = phase === "cards-fly" && !cardsAnimated;
                  const delay = i * 120;

                  return (
                    <div
                      key={t.id}
                      className="hover:!translate-y-[-20px] hover:!rotate-0 hover:z-20"
                      style={{
                        transform:
                          isFlying
                            ? "scale(0.3) translateY(-40vh)"
                            : `rotate(${cardTransforms[i].rotate}deg) translateX(${cardTransforms[i].translateX}px) translateY(${cardTransforms[i].translateY}px)`,
                        opacity: isFlying ? 0 : 1,
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
  );
};

export default Index;
