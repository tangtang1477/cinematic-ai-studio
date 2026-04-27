import { useState } from "react";
import { Template } from "@/data/templates";
import { Sparkles } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onTry: (prompt: string) => void;
  noOverlay?: boolean;
  compact?: boolean;
}

const TemplateCard = ({ template, onTry, noOverlay = false, compact = false }: TemplateCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/40"
      style={{
        aspectRatio: "3/4",
        isolation: "isolate",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered((h) => !h)}
    >
      <img
        src={template.image}
        alt={template.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="async"
      />

      {!noOverlay && (
        <>
          {/* Single gradient overlay — replaces unreliable backdrop-filter layers */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 1,
              height: compact ? "60px" : "120px",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.65) 80%, rgba(0,0,0,0.75) 100%)",
            }}
          />

          <div className={`absolute bottom-0 left-0 right-0 z-10 ${compact ? "px-1 py-1" : "px-3 py-2"}`}>
            {!compact && (
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
            )}

            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out"
              style={{
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0)" : "translateY(6px)",
                pointerEvents: hovered ? "auto" : "none",
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTry(template.prompt);
                }}
                className={`glass-btn flex items-center justify-center text-foreground font-medium transition-all duration-200 ${
                  compact
                    ? "p-1.5"
                    : "gap-1.5 px-4 py-2 text-[12px]"
                }`}
                style={{ borderRadius: compact ? "999px" : "16px" }}
                aria-label={compact ? "Try this template" : undefined}
              >
                <Sparkles className={`relative z-10 ${compact ? "h-3 w-3" : "h-3 w-3"}`} />
                {!compact && <span className="relative z-10">Try this</span>}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateCard;
