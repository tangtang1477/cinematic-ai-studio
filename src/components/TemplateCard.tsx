import { useState } from "react";
import { Template } from "@/data/templates";
import { Sparkles } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onTry: (prompt: string) => void;
}

const TemplateCard = ({ template, onTry }: TemplateCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative isolate rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/40"
      style={{ aspectRatio: "3/4", transform: "translateZ(0)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={template.image}
        alt={template.title}
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
      />

      {/* Top-edge gradient blur layer — DO NOT REMOVE */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 1,
          height: "90px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 py-2">
        <div
          className="transition-all duration-200 ease-out"
          style={{
            opacity: hovered ? 0 : 1,
            transform: hovered ? "translateY(4px)" : "translateY(0)",
          }}
        >
          <p className="text-[12px] text-foreground/60 leading-[18px] line-clamp-3">
            {template.description}
          </p>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            pointerEvents: hovered ? "auto" : "none",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onTry(template.prompt); }}
            className="glass-btn flex items-center justify-center gap-1.5 px-4 py-2 text-foreground text-[12px] font-medium transition-all duration-200"
            style={{ borderRadius: "16px" }}
          >
            <Sparkles className="relative z-10 h-3 w-3" />
            <span className="relative z-10">Try this</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
