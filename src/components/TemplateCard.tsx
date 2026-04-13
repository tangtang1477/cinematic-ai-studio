import { Template } from "@/data/templates";
import { Sparkles } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onTry: (prompt: string) => void;
}

const TemplateCard = ({ template, onTry }: TemplateCardProps) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 bg-card border border-border/50 hover:border-primary/20">
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${template.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-background/60 backdrop-blur-sm text-foreground/70 border border-border/40"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1.5 tracking-tight">
          {template.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {template.description}
        </p>

        {/* Try button */}
        <button
          onClick={() => onTry(template.prompt)}
          className="glass-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
            text-primary-foreground text-xs font-semibold
            opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-200"
        >
          <Sparkles className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">Try this</span>
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
