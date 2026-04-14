import { useState, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import HeroSection from "@/components/HeroSection";
import CreationPanel from "@/components/CreationPanel";
import CategoryFilter from "@/components/CategoryFilter";
import TemplateCard from "@/components/TemplateCard";
import { templates } from "@/data/templates";

const Index = () => {
  const [category, setCategory] = useState("All");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("1");
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [voiceover, setVoiceover] = useState(false);

  const filtered = category === "All"
    ? templates
    : templates.filter((t) => t.category === category);

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
  }, []);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AppSidebar />
      <div className="flex-1 ml-[88px] flex flex-col h-screen overflow-hidden">
        {/* Fixed top: Hero + Category */}
        <div className="flex-shrink-0">
          <HeroSection />
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>

        {/* Scrollable cards */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-6 pb-4">
          <div className="max-w-[1796px] mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {filtered.map((t) => (
                <TemplateCard key={t.id} template={t} onTry={handleTry} />
              ))}
            </div>
          </div>
        </div>

        {/* Fixed bottom input bar */}
        <div className="flex-shrink-0">
          <CreationPanel
            prompt={prompt}
            onPromptChange={setPrompt}
            duration={duration}
            onDurationChange={setDuration}
            orientation={orientation}
            onOrientationChange={setOrientation}
            voiceover={voiceover}
            onVoiceoverChange={setVoiceover}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
