import { useState } from "react";
import { ArrowLeft, Heart, Send, VolumeX, Volume2 } from "lucide-react";
import MobileRemixInput from "./MobileRemixInput";
import remixIcon from "@/assets/icons/remix.svg";

export interface PlayerCard {
  id: string;
  title: string;
  clip: string;
}

interface Props {
  card: PlayerCard | null;
  onClose: () => void;
}

const MobileVideoPlayer = ({ card, onClose }: Props) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128);
  const [muted, setMuted] = useState(true);
  const [remixOpen, setRemixOpen] = useState(false);

  if (!card) return null;

  const isVideo = /\.(mp4|webm|mov)$/i.test(card.clip);

  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  const toggleLike = () => {
    setLiked((prev) => {
      setLikeCount((c) => c + (prev ? -1 : 1));
      return !prev;
    });
  };

  const labelStyle = {
    color: "#fff",
    fontSize: 13,
    lineHeight: "16px",
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
    fontWeight: 500,
  } as const;

  const circleBtn = {
    width: 40,
    height: 40,
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  } as const;

  return (
    <div
      className="fixed inset-0 z-[60] md:hidden"
      style={{ background: "#000", color: "#fff" }}
    >
      {/* Background clip */}
      {isVideo ? (
        <video
          src={card.clip}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={muted}
          playsInline
        />
      ) : (
        <img
          src={card.clip}
          alt={card.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Subtle bottom gradient for legibility */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "40%",
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))",
        }}
      />

      {/* Back */}
      <button
        onClick={onClose}
        aria-label="Back"
        className="absolute flex items-center justify-center rounded-full active:scale-95 transition-transform"
        style={{ ...circleBtn, top: 16, left: 16 }}
      >
        <ArrowLeft size={20} color="#fff" />
      </button>

      {/* Title — Lab */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: 24,
          fontSize: 17,
          fontWeight: 600,
          color: "#fff",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
        }}
      >
        Lab
      </div>

      {/* Sound */}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute" : "Mute"}
        className="absolute flex items-center justify-center rounded-full active:scale-95 transition-transform"
        style={{ ...circleBtn, top: 16, right: 16 }}
      >
        {muted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
      </button>

      {/* Right action rail */}
      <div
        className="absolute flex flex-col items-center"
        style={{ right: 12, bottom: 120, gap: 22 }}
      >
        <button
          onClick={toggleLike}
          className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
          aria-label="Like"
        >
          <Heart
            size={32}
            color={liked ? "#ef4444" : "#fff"}
            fill={liked ? "#ef4444" : "transparent"}
            strokeWidth={1.8}
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
          />
          <span style={labelStyle}>{fmt(likeCount)}</span>
        </button>

        <button
          onClick={() => setRemixOpen(true)}
          className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
          aria-label="Remix"
        >
          <img
            src={remixIcon}
            alt=""
            aria-hidden
            style={{
              width: 32,
              height: 32,
              filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
            }}
          />
          <span style={labelStyle}>Remix</span>
        </button>

        <button
          onClick={() => console.log("[Player] share")}
          className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
          aria-label="Share"
        >
          <Send
            size={30}
            color="#fff"
            strokeWidth={1.8}
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
          />
          <span style={labelStyle}>Share</span>
        </button>
      </div>

      {/* Title */}
      <div
        className="absolute left-4 right-20"
        style={{ bottom: 32 }}
      >
        <p style={{ ...labelStyle, fontSize: 15, fontWeight: 600 }}>
          {card.title}
        </p>
      </div>

      <MobileRemixInput
        open={remixOpen}
        onClose={() => setRemixOpen(false)}
        onSubmit={(t) => console.log("[Remix]", t)}
      />
    </div>
  );
};

export default MobileVideoPlayer;
