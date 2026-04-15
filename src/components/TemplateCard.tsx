import { useState } from "react";
import { Template } from "@/data/templates";
import { Sparkles } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onTry: (prompt: string) => void;
  /** When true, skip blur overlay (used during 3D flight animation) */
  noOverlay?: boolean;
}

/**
 * Template card — image + text overlay with glass blur.
 * 
 * Overlay structure (when noOverlay=false):
 *   Layer 1: Feather blur band — top-edge gradient blur transition
 *   Layer 2: Dark gradient — bottom darkening
 *   Layer 3: Strong bottom blur — glass effect under text
 *   Layer 4: Text content
 * 
 * The overlay container uses `isolation: isolate` and `transform: translateZ(0)`
 * to create an independent compositing context. This ensures backdrop-filter
 * works even if the card was previously in a 3D context.
 */
const TemplateCard = ({ template, onTry, noOverlay = false }: TemplateCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/40"
      style={{ aspectRatio: "3/4" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pure image layer — no filters, no transforms */}
      <img
        src={template.image}
        alt={template.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="sync"
      />

      {/* Overlay container — completely independent compositing context */}
      {!noOverlay && (
        <div
          className="absolute inset-0"
          style={{
            isolation: "isolate",
            transform: "translateZ(0)",
          }}
        >
          {/* Layer 1: Feather blur band — visible gradient blur at top edge of overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 1,
              height: "100px",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 60%, black 80%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 60%, black 80%)",
            }}
          />

          {/* Layer 2: Dark gradient overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 2,
              height: "120px",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Layer 3: Strong bottom blur — extra glass under text */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 3,
              height: "44px",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          />

          {/* Layer 4: Text content */}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onTry(template.prompt);
                }}
                className="glass-btn flex items-center justify-center gap-1.5 px-4 py-2 text-foreground text-[12px] font-medium transition-all duration-200"
                style={{ borderRadius: "16px" }}
              >
                <Sparkles className="relative z-10 h-3 w-3" />
                <span className="relative z-10">Try this</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
