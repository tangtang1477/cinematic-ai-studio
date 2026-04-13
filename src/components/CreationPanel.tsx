import { Wand2 } from "lucide-react";

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
}: CreationPanelProps) => {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-88px-48px)]"
      style={{ maxWidth: 800, marginLeft: "calc(88px / 2)" }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Input area */}
        <div className="px-5 pt-4 pb-2">
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
        <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
          {/* Model pill */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] text-foreground/60"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            Seedance 2.0
          </div>

          {/* Duration pills */}
          <div className="flex gap-1">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => onDurationChange(d)}
                className={`px-2.5 py-1.5 rounded-full text-[12px] font-medium transition-all
                  ${duration === d
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                  }`}
                style={duration !== d ? { background: "rgba(255,255,255,0.04)" } : {}}
              >
                {d}m
              </button>
            ))}
          </div>

          {/* Ratio toggle */}
          <div className="flex gap-1">
            {(["landscape", "portrait"] as const).map((o) => (
              <button
                key={o}
                onClick={() => onOrientationChange(o)}
                className={`px-2.5 py-1.5 rounded-full text-[12px] font-medium transition-all
                  ${orientation === o
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                  }`}
                style={orientation !== o ? { background: "rgba(255,255,255,0.04)" } : {}}
              >
                {o === "landscape" ? "16:9" : "9:16"}
              </button>
            ))}
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
