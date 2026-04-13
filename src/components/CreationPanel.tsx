import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wand2, Monitor, Smartphone } from "lucide-react";

interface CreationPanelProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  duration: string;
  onDurationChange: (val: string) => void;
  orientation: "landscape" | "portrait";
  onOrientationChange: (val: "landscape" | "portrait") => void;
  voiceover: boolean;
  onVoiceoverChange: (val: boolean) => void;
}

const durations = ["1", "2", "3", "6", "10"];

const CreationPanel = ({
  prompt,
  onPromptChange,
  duration,
  onDurationChange,
  orientation,
  onOrientationChange,
  voiceover,
  onVoiceoverChange,
}: CreationPanelProps) => {
  return (
    <section id="creation-panel" className="w-full">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "hsl(var(--foreground) / 0.05)",
          border: "1px solid hsl(var(--foreground) / 0.08)",
        }}
      >
        {/* Prompt input area */}
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe the video you want to create..."
            rows={4}
            className="w-full bg-transparent text-[14px] text-foreground placeholder:text-foreground/30 resize-none px-5 py-4 focus:outline-none leading-relaxed"
          />

          {/* Bottom bar inside input */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: "1px solid hsl(var(--foreground) / 0.06)" }}
          >
            <span className="text-[12px] text-foreground/30">
              {prompt.length > 0 ? `${prompt.length} characters` : 'Click "Try this" on any template to auto-fill'}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              <span className="text-[10px] text-foreground/30">AI-enhanced</span>
            </div>
          </div>

          {/* Focus glow border */}
          <div className="absolute -inset-[1px] rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary) / 0.3), transparent, hsl(var(--primary) / 0.15))",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: "1px",
            }}
          />
        </div>

        {/* Controls row */}
        <div
          className="px-5 py-4 flex flex-wrap items-end gap-5"
          style={{ borderTop: "1px solid hsl(var(--foreground) / 0.06)" }}
        >
          {/* Model */}
          <div className="space-y-1.5">
            <Label className="text-[12px] text-foreground/40">Model</Label>
            <Select defaultValue="seedance">
              <SelectTrigger
                className="rounded-lg text-[13px] h-8 w-[140px] border-foreground/10 bg-foreground/5 text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seedance">Seedance 2.0</SelectItem>
                <SelectItem value="happyhorse" disabled>Happy Horse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <Label className="text-[12px] text-foreground/40">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger
                className="rounded-lg text-[13px] h-8 w-[110px] border-foreground/10 bg-foreground/5 text-foreground"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <Label className="text-[12px] text-foreground/40">Duration</Label>
            <div className="flex gap-1">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => onDurationChange(d)}
                  className={`h-8 px-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    duration === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/5 text-foreground/50 hover:text-foreground hover:bg-foreground/10 border border-foreground/10"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-1.5">
            <Label className="text-[12px] text-foreground/40">Aspect Ratio</Label>
            <div className="flex gap-1">
              <button
                onClick={() => onOrientationChange("landscape")}
                className={`h-8 px-3 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-all duration-150 ${
                  orientation === "landscape"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-foreground/50 hover:text-foreground hover:bg-foreground/10 border border-foreground/10"
                }`}
              >
                <Monitor className="w-3 h-3" />
                16:9
              </button>
              <button
                onClick={() => onOrientationChange("portrait")}
                className={`h-8 px-3 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-all duration-150 ${
                  orientation === "portrait"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground/5 text-foreground/50 hover:text-foreground hover:bg-foreground/10 border border-foreground/10"
                }`}
              >
                <Smartphone className="w-3 h-3" />
                9:16
              </button>
            </div>
          </div>

          {/* Voiceover */}
          <div className="space-y-1.5">
            <Label className="text-[12px] text-foreground/40">Voiceover</Label>
            <div className="flex items-center h-8 gap-2">
              <Switch checked={voiceover} onCheckedChange={onVoiceoverChange} />
              <span className="text-[13px] text-foreground/50">
                {voiceover ? "On" : "Off"}
              </span>
            </div>
          </div>

          {/* Spacer + Generate button */}
          <div className="flex-1 flex justify-end">
            <button
              className="glass-btn flex items-center justify-center gap-2 h-9 px-6 rounded-lg
                text-primary-foreground font-medium text-[14px]"
            >
              <Wand2 className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Generate</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreationPanel;
