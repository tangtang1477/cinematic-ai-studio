import { useState, useRef, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import TemplateCard from "@/components/TemplateCard";
import CreationPanel from "@/components/CreationPanel";
import { templates } from "@/data/templates";

const Index = () => {
  const [category, setCategory] = useState("All");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("2");
  const [orientation, setOrientation] = useState<"landscape" | "portrait">("landscape");
  const [voiceover, setVoiceover] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const filtered = category === "All"
    ? templates
    : templates.filter((t) => t.category === category);

  const handleTry = useCallback((templatePrompt: string) => {
    setPrompt(templatePrompt);
    document.getElementById("creation-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <CategoryFilter selected={category} onSelect={setCategory} />

      {/* Template grid */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} onTry={handleTry} />
          ))}
        </div>
      </section>

      <div ref={panelRef}>
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
  );
};

export default Index;
