import { useState, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import CreationPanel from "@/components/CreationPanel";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";
import type { AspectRatio } from "@/components/CreationPanel";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("1");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [voiceover, setVoiceover] = useState(false);

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
  }, []);

  // Fan-spread card transforms
  const cardTransforms = [
    { rotate: -8, translateX: 20, translateY: 10 },
    { rotate: -3, translateX: 6, translateY: 0 },
    { rotate: 3, translateX: -6, translateY: 0 },
    { rotate: 8, translateX: -20, translateY: 10 },
  ];

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AppSidebar />
      <div className="flex-1 ml-[88px] flex flex-col h-screen overflow-hidden relative">
        {/* 3D ambient background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 70%, rgba(113,240,246,0.06) 0%, transparent 70%)",
            }}
          />
          {/* Floating orbs */}
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

        {/* Fixed top: Creation Panel */}
        <div className="flex-shrink-0 relative z-10">
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
        <div className="flex-1 overflow-y-auto hide-scrollbar relative z-10">
          <HeroSection />

          {/* Fan-spread card layout */}
          <div className="flex justify-center items-end py-8 px-6">
            <div className="flex items-end gap-[-20px]" style={{ perspective: "1200px" }}>
              {templates.map((t, i) => (
                <div
                  key={t.id}
                  className="transition-all duration-500 hover:!translate-y-[-20px] hover:!rotate-0 hover:z-20"
                  style={{
                    transform: `rotate(${cardTransforms[i].rotate}deg) translateX(${cardTransforms[i].translateX}px) translateY(${cardTransforms[i].translateY}px)`,
                    transformOrigin: "bottom center",
                    width: "220px",
                    marginLeft: i === 0 ? 0 : "-16px",
                    zIndex: i === 1 || i === 2 ? 10 : 5,
                  }}
                >
                  <TemplateCard template={t} onTry={handleTry} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
