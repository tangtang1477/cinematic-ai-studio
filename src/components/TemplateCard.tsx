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
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200
        hover:ring-2 hover:ring-primary/40"
      style={{ aspectRatio: "3/4" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={template.image}
        alt={template.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Gradient fade above glass panel */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "50%" }}
      >
        <div
          className="w-full h-full"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      {/* Frosted glass overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-200"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "rgba(255,255,255,0.08)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
        }}
      >
        {!hovered ? (
          <div className="px-3 py-3">
            <p className="text-[12px] text-foreground/60 leading-[18px] line-clamp-3">
              {template.description}
            </p>
          </div>
        ) : (
          <div className="px-3 py-2.5 flex justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); onTry(template.prompt); }}
              className="glass-btn flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg
                text-foreground text-[12px] font-medium transition-all duration-200"
            >
              <Sparkles className="w-3 h-3 relative z-10" />
              <span className="relative z-10">Try this</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
