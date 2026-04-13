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
    <section id="creation-panel" className="max-w-4xl mx-auto px-6 pb-20">
      <div className="glass-strong rounded-3xl p-8 shadow-glass-lg">
        <h2 className="text-lg font-semibold text-foreground mb-1 tracking-tight">
          Create Your Video
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Describe your vision or use a template above to get started.
        </p>

        {/* Premium prompt input */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/30 via-cyan-400/20 to-primary/30 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-[1px]" />
          <div className="relative rounded-2xl bg-muted/50 border border-border/60 overflow-hidden transition-all duration-300 group-focus-within:border-primary/30">
            <textarea
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Describe the video you want to create..."
              rows={5}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none px-5 py-4 focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between px-5 py-3 border-t border-border/40">
              <span className="text-xs text-muted-foreground">
                {prompt.length > 0 ? `${prompt.length} characters` : "Tip: Click \"Try this\" on any template to auto-fill"}
              </span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <span className="text-[10px] text-muted-foreground">AI-enhanced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {/* Model */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Model</Label>
            <Select defaultValue="seedance">
              <SelectTrigger className="rounded-xl bg-muted/50 border-border/60 text-xs h-9 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seedance">Seedance 2.0</SelectItem>
                <SelectItem value="happyhorse" disabled>
                  Happy Horse
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger className="rounded-xl bg-muted/50 border-border/60 text-xs h-9 text-foreground">
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
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Duration</Label>
            <div className="flex gap-1">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => onDurationChange(d)}
                  className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all duration-150 ${
                    duration === d
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Aspect Ratio</Label>
            <div className="flex gap-1">
              <button
                onClick={() => onOrientationChange("landscape")}
                className={`flex-1 h-9 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 ${
                  orientation === "landscape"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60"
                }`}
              >
                <Monitor className="w-3 h-3" />
                16:9
              </button>
              <button
                onClick={() => onOrientationChange("portrait")}
                className={`flex-1 h-9 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-150 ${
                  orientation === "portrait"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60"
                }`}
              >
                <Smartphone className="w-3 h-3" />
                9:16
              </button>
            </div>
          </div>

          {/* Voiceover */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Voiceover</Label>
            <div className="flex items-center h-9 gap-3">
              <Switch checked={voiceover} onCheckedChange={onVoiceoverChange} />
              <span className="text-xs text-muted-foreground">
                {voiceover ? "On" : "Off"}
              </span>
            </div>
          </div>
        </div>

        {/* Generate button — Aideo glass style */}
        <button
          className="glass-btn w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl
            text-primary-foreground font-semibold text-sm"
        >
          <Wand2 className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Generate Video</span>
        </button>
      </div>
    </section>
  );
};

export default CreationPanel;
