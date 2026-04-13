import { Template } from "@/data/templates";
import { Sparkles } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onTry: (prompt: string) => void;
}

const TemplateCard = ({ template, onTry }: TemplateCardProps) => {
  return (
    <div
      className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200
        hover:ring-2 hover:ring-primary/40"
      style={{ aspectRatio: "3/4" }}
    >
      {/* Image */}
      <img
        src={template.image}
        alt={template.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Frosted glass description overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div
          className="rounded-lg p-3"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h3 className="text-[14px] font-bold text-foreground mb-1 leading-[20px]">
            {template.title}
          </h3>
          <p className="text-[12px] text-foreground/50 leading-[18px] line-clamp-3">
            {template.description}
          </p>

          {/* Try button on hover */}
          <button
            onClick={(e) => { e.stopPropagation(); onTry(template.prompt); }}
            className="glass-btn w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
              text-foreground text-[12px] font-medium mt-2
              opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-200"
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
