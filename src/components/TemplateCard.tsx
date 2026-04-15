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
 * The blur overlay layers are rendered OUTSIDE preserve-3d contexts
 * by using `transform: translateZ(0)` to isolate compositing.
 */
const TemplateCard = ({ template, onTry, noOverlay = false }: TemplateCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary/40"
      style={{
        aspectRatio: "3/4",
        /* Force a new compositing layer — isolates backdrop-filter from parent 3D */
        isolation: "isolate",
        transform: "translateZ(0)",
        willChange: "transform",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={template.image}
        alt={template.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        decoding="sync"
      />

      {!noOverlay && (
        <>
          {/* === THREE-LAYER OVERLAY — DO NOT REMOVE ANY LAYER === */}

          {/* Layer 1: Upper gradient darkening — DO NOT REMOVE */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 1,
              height: "110px",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* Layer 2: Upper edge blur transition — DO NOT REMOVE */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 2,
              height: "80px",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 50%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 50%)",
            }}
          />

          {/* Layer 3: Bottom strong blur — DO NOT REMOVE */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              zIndex: 3,
              height: "40px",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          />

          {/* === END OVERLAY LAYERS === */}

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
        </>
      )}
    </div>
  );
};

export default TemplateCard;
