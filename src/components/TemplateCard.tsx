import { Template } from "@/data/templates";
import { Sparkles } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onTry: (prompt: string) => void;
}

const TemplateCard = ({ template, onTry }: TemplateCardProps) => {
  return (
    <div
      className="group relative rounded-lg overflow-hidden transition-all duration-200
        hover:ring-2 hover:ring-primary/40 active:brightness-75 cursor-pointer"
      style={{ background: "hsl(var(--foreground) / 0.05)" }}
    >
      {/* Thumbnail */}
      <div className={`relative h-[160px] bg-gradient-to-br ${template.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-2.5 left-2.5 flex gap-1">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[10px] font-medium text-foreground/70"
              style={{ background: "hsl(var(--foreground) / 0.15)", backdropFilter: "blur(8px)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[14px] font-bold text-foreground mb-1 leading-[20px]">
          {template.title}
        </h3>
        <p className="text-[12px] text-foreground/40 leading-[18px] line-clamp-2 mb-3">
          {template.description}
        </p>

        {/* Try button */}
        <button
          onClick={() => onTry(template.prompt)}
          className="glass-btn w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
            text-primary-foreground text-[12px] font-medium
            opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-200"
        >
          <Sparkles className="w-3 h-3 relative z-10" />
          <span className="relative z-10">Try this</span>
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
