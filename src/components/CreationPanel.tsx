import { Wand2, ChevronDown, Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import iconTime from "@/assets/icon-time.svg";

export type AspectRatio = "16:9" | "9:16" | "3:4" | "4:3";
export type CreationMode = "story" | "audiobook";

interface CreationPanelProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  duration: string;
  onDurationChange: (val: string) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (val: AspectRatio) => void;
  voiceover: boolean;
  onVoiceoverChange: (val: boolean) => void;
  mode: CreationMode;
  onModeChange: (val: CreationMode) => void;
  voice: string;
  onVoiceChange: (val: string) => void;
}

const durations = [
  { value: "1", label: "1 min" },
  { value: "2", label: "2 min" },
  { value: "3", label: "3 min" },
  { value: "6", label: "6 min" },
  { value: "10", label: "10 min" },
];

const aspectRatios: { value: AspectRatio; label: string; w: number; h: number }[] = [
  { value: "16:9", label: "16:9", w: 16, h: 9 },
  { value: "9:16", label: "9:16", w: 9, h: 16 },
  { value: "4:3", label: "4:3", w: 4, h: 3 },
  { value: "3:4", label: "3:4", w: 3, h: 4 },
];

const voices = [
  { value: "warm-female", label: "Warm Female" },
  { value: "calm-male", label: "Calm Male" },
  { value: "youthful", label: "Youthful" },
  { value: "intellectual-female", label: "Intellectual Female" },
];

const tabs: { value: CreationMode; label: string }[] = [
  { value: "story", label: "Stories" },
  { value: "audiobook", label: "Audiobooks" },
];

const RatioIcon = ({ w, h, size = 14 }: { w: number; h: number; size?: number }) => {
  const maxDim = size;
  const scale = maxDim / Math.max(w, h);
  const rw = w * scale;
  const rh = h * scale;
  return (
    <svg width={maxDim} height={maxDim} viewBox={`0 0 ${maxDim} ${maxDim}`}>
      <rect
        x={(maxDim - rw) / 2}
        y={(maxDim - rh) / 2}
        width={rw}
        height={rh}
        rx={1.5}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  );
};

const CreationPanel = ({
  prompt,
  onPromptChange,
  duration,
  onDurationChange,
  aspectRatio,
  onAspectRatioChange,
  voiceover,
  onVoiceoverChange,
  mode,
  onModeChange,
  voice,
  onVoiceChange,
}: CreationPanelProps) => {
  const currentDuration = durations.find((d) => d.value === duration);
  const currentRatio = aspectRatios.find((r) => r.value === aspectRatio) || aspectRatios[0];
  const currentVoice = voices.find((v) => v.value === voice) || voices[0];

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 pt-4 pb-2">
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(113,240,246,0.1)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(113,240,246,0.03)",
        }}
      >
        <Tabs activeMode={mode} onModeChange={onModeChange} />

        {/* Input area */}
        <div className="px-5 pt-3 pb-1">
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={
              mode === "story"
                ? "Describe the 3D video you want to create..."
                : "Paste or write the text you want narrated..."
            }
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

          {/* Duration dropdown — only in Stories mode */}
          {mode === "story" && (
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
          )}

          {/* Aspect ratio dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] text-foreground/70 transition-colors hover:text-foreground/90"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <RatioIcon w={currentRatio.w} h={currentRatio.h} />
                {currentRatio.label}
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
              {aspectRatios.map((r) => (
                <DropdownMenuItem
                  key={r.value}
                  onClick={() => onAspectRatioChange(r.value)}
                  className={`text-[13px] flex items-center gap-2 ${aspectRatio === r.value ? "text-primary" : "text-foreground/70"}`}
                >
                  <RatioIcon w={r.w} h={r.h} />
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Voice dropdown — only in Audiobooks mode */}
          {mode === "audiobook" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] text-foreground/70 transition-colors hover:text-foreground/90"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <Mic className="w-3.5 h-3.5 opacity-70" />
                  {currentVoice.label}
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
                {voices.map((v) => (
                  <DropdownMenuItem
                    key={v.value}
                    onClick={() => onVoiceChange(v.value)}
                    className={`text-[13px] ${voice === v.value ? "text-primary" : "text-foreground/70"}`}
                  >
                    {v.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

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
