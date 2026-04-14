import { useState } from "react";
import { Wand2, Monitor, Smartphone, ChevronDown, Mic } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import iconTime from "@/assets/icon-time.svg";

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

const durations = [
  { value: "1", label: "1 min" },
  { value: "2", label: "2 min" },
  { value: "3", label: "3 min" },
  { value: "6", label: "6 min" },
  { value: "10", label: "10 min" },
];

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
  const currentDuration = durations.find((d) => d.value === duration);

  return (
    <div className="w-full px-4 pb-4">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Input area */}
        <div className="px-5 pt-3 pb-1">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe the video you want to create..."
            rows={2}
            className="w-full bg-transparent text-[14px] text-foreground placeholder:text-foreground/25
              resize-none focus:outline-none leading-relaxed"
          />
        </div>

        {/* Controls row */}
        <div className="px-5 pb-3 flex items-center gap-2 flex-wrap">
          {/* Model dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] text-foreground/70 transition-colors hover:text-foreground/90"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                Seedance 2.0
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-[160px]"
              style={{
                background: "rgba(30,30,30,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <DropdownMenuItem className="text-foreground/90 text-[13px]">
                Seedance 2.0
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="text-foreground/30 text-[13px]">
                Happy Horse
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Duration dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] text-foreground/70 transition-colors hover:text-foreground/90"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <img src={iconTime} alt="Duration" className="w-3.5 h-3.5 opacity-70" />
                {currentDuration?.label || "1 min"}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-[120px]"
              style={{
                background: "rgba(30,30,30,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {durations.map((d) => (
                <DropdownMenuItem
                  key={d.value}
                  onClick={() => onDurationChange(d.value)}
                  className={`text-[13px] ${duration === d.value ? "text-primary" : "text-foreground/70"}`}
                >
                  {d.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Aspect ratio toggle */}
          <div
            className="flex rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <button
              onClick={() => onOrientationChange("landscape")}
              className={`flex items-center gap-1 px-3 py-1.5 text-[12px] transition-all ${
                orientation === "landscape"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/40 hover:text-foreground/70"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9</span>
            </button>
            <button
              onClick={() => onOrientationChange("portrait")}
              className={`flex items-center gap-1 px-3 py-1.5 text-[12px] transition-all ${
                orientation === "portrait"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/40 hover:text-foreground/70"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16</span>
            </button>
          </div>

          {/* Voiceover toggle */}
          <div className="flex items-center gap-1.5 px-2">
            <Mic className="w-3.5 h-3.5 text-foreground/50" />
            <span className="text-[12px] text-foreground/50">Voiceover</span>
            <Switch
              checked={voiceover}
              onCheckedChange={onVoiceoverChange}
              className="scale-75 origin-left"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Generate button */}
          <button className="glass-btn flex items-center gap-2 px-5 py-2 rounded-full text-foreground font-medium text-[13px]">
            <Wand2 className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Make</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreationPanel;
