import { Textarea } from "@/components/ui/textarea";
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

        {/* Prompt input */}
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe the video you want to create..."
          className="min-h-[120px] rounded-2xl bg-background/60 border-border/50 text-sm resize-none mb-6 focus-visible:ring-primary/30"
        />

        {/* Controls grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {/* Model */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Model</Label>
            <Select defaultValue="seedance">
              <SelectTrigger className="rounded-xl bg-background/60 border-border/50 text-xs h-9">
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
              <SelectTrigger className="rounded-xl bg-background/60 border-border/50 text-xs h-9">
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
                      : "bg-background/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
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
                    : "bg-background/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
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
                    : "bg-background/60 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
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

        {/* Generate button */}
        <button
          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl
            bg-gradient-to-r from-primary via-purple-500 to-pink-500
            text-primary-foreground font-semibold text-sm
            shadow-glass hover:shadow-card-hover transition-all duration-300
            hover:scale-[1.01] active:scale-[0.99]"
        >
          <Wand2 className="w-4 h-4" />
          Generate Video
        </button>
      </div>
    </section>
  );
};

export default CreationPanel;
