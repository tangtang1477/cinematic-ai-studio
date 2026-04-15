/**
 * Poker card back design — ornate blue pattern inspired by classic playing cards.
 * Used as the backface during the 3D card flip animation.
 */
const CardBack = () => (
  <div
    className="w-full h-full rounded-xl overflow-hidden"
    style={{
      background: "linear-gradient(135deg, #1e3a6e 0%, #2a5298 30%, #1e3a6e 50%, #2a5298 70%, #1e3a6e 100%)",
      border: "3px solid rgba(180,200,240,0.35)",
      boxShadow: "inset 0 0 30px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.5)",
    }}
  >
    {/* Inner border frame */}
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        margin: "6px",
        width: "calc(100% - 12px)",
        height: "calc(100% - 12px)",
        borderRadius: "8px",
        border: "1.5px solid rgba(180,200,240,0.25)",
        background: `
          repeating-linear-gradient(45deg,
            rgba(100,160,240,0.08) 0px, rgba(100,160,240,0.08) 2px,
            transparent 2px, transparent 8px
          ),
          repeating-linear-gradient(-45deg,
            rgba(100,160,240,0.08) 0px, rgba(100,160,240,0.08) 2px,
            transparent 2px, transparent 8px
          ),
          radial-gradient(ellipse at center, rgba(60,120,200,0.3) 0%, transparent 70%)
        `,
      }}
    >
      {/* Center diamond ornament */}
      <div
        style={{
          width: "40%",
          height: "40%",
          borderRadius: "6px",
          transform: "rotate(45deg)",
          border: "1.5px solid rgba(180,200,240,0.3)",
          background: "linear-gradient(135deg, rgba(40,80,160,0.6) 0%, rgba(60,120,220,0.4) 100%)",
          boxShadow: "inset 0 0 16px rgba(100,160,240,0.2), 0 0 12px rgba(60,120,200,0.15)",
        }}
      />
    </div>
  </div>
);

export default CardBack;
