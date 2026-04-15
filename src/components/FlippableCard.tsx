import CardBack from "./CardBack";

interface FlippableCardProps {
  front: React.ReactNode;
}

const FlippableCard = ({ front }: FlippableCardProps) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Front face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "flat",
          transform: "rotateY(0deg) translateZ(0.1px)",
          borderRadius: "12px",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        {front}
      </div>

      {/* Back face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "flat",
          transform: "rotateY(180deg) translateZ(0.1px)",
          borderRadius: "12px",
          overflow: "hidden",
          willChange: "transform",
        }}
      >
        <CardBack />
      </div>
    </div>
  );
};

export default FlippableCard;
