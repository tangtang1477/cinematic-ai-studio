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

      {/* Gradient blur transition zone — always present, upper edge softener */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: "80px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
        }}
      />

      {/* Content layer — sits on top of the glass, switches between text and button */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
        {/* Description text */}
        <div
          className="transition-all duration-200 ease-out"
          style={{
            opacity: hovered ? 0 : 1,
            transform: hovered ? "translateY(4px)" : "translateY(0)",
            position: hovered ? "absolute" : "relative",
            left: 0, right: 0, bottom: 8,
            paddingLeft: 12, paddingRight: 12,
          }}
        >
          <p className="text-[12px] text-foreground/60 leading-[18px] line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Try this button */}
        <div
          className="flex justify-center transition-all duration-200 ease-out"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onTry(template.prompt); }}
            className="glass-btn flex items-center justify-center gap-1.5 px-4 py-2
              text-foreground text-[12px] font-medium transition-all duration-200"
            style={{ borderRadius: "16px" }}
          >
            <Sparkles className="w-3 h-3 relative z-10" />
            <span className="relative z-10">Try this</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
