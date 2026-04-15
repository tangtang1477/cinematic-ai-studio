import CardBack from "./CardBack";

interface FlippableCardProps {
  front: React.ReactNode;
  animationDelay?: number;
}

/**
 * Stable 3D flippable card.
 * Structure: wrapper(perspective) → rotator(preserve-3d + animation) → front/back faces
 * The PARENT handles flight position/rotation. This component ONLY handles the flip.
 */
const FlippableCard = ({ front, animationDelay = 0 }: FlippableCardProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        perspective: "1200px",
      }}
    >
      {/* Rotator — owns preserve-3d and the flip+scale animation */}
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          animation: `cardFlip 2.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${animationDelay}ms both`,
        }}
      >
        {/* Front face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg) translateZ(1px)",
            borderRadius: "12px",
            overflow: "hidden",
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
            transform: "rotateY(180deg) translateZ(1px)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <CardBack />
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;
