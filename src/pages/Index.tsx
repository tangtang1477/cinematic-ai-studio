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
  const [duration, setDuration] = useState("2");
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [voiceover, setVoiceover] = useState(false);

  const filtered = category === "All"
    ? templates
    : templates.filter((t) => t.category === category);

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 ml-[88px] overflow-y-auto hide-scrollbar px-6 py-8 pb-40">
        <div className="max-w-[1796px] mx-auto flex flex-col">
          <HeroSection />
          <CategoryFilter selected={category} onSelect={setCategory} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onTry={handleTry} />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom input bar */}
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
  );
};

export default Index;
