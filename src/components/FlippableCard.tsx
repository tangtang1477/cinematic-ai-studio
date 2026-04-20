import CardBack from "./CardBack";

interface FlippableCardProps {
  front: React.ReactNode;
}

/**
 * Stable 3D flip container.
 * - Single rotator owns rotateY
 * - Faces use minimal transform; no nested preserve-3d, no translateZ chain
 * - Avoids browser backface-culling artifacts that produced black backs
 */
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
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {front}
      </div>

      {/* Back face — rotated 180 so it shows when parent rotateY ~180 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <CardBack />
      </div>
    </div>
  );
};

export default FlippableCard;
