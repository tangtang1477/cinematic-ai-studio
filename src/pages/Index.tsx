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
    document.getElementById("creation-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex-1 ml-[88px] overflow-y-auto hide-scrollbar px-6 py-8">
        <div className="max-w-[1796px] mx-auto flex flex-col">
          {/* Hero */}
          <HeroSection />

          {/* Creation panel at top */}
          <div style={{ marginBottom: 32 }}>
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

          {/* Section title */}
          <h2 className="text-[20px] font-bold text-foreground leading-7 mb-4">
            Templates
          </h2>

          {/* Category filter */}
          <CategoryFilter selected={category} onSelect={setCategory} />

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
            {filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onTry={handleTry} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
