import CardBack from "./CardBack";

interface FlippableCardProps {
  front: React.ReactNode;
}

/**
 * A card with two faces. The PARENT must have transformStyle: "preserve-3d"
 * and apply the rotation animation. This component renders front/back
 * with proper backface-visibility.
 */
const FlippableCard = ({ front }: FlippableCardProps) => {
  return (
    <>
      {/* Front face */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(0deg)",
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
          transform: "rotateY(180deg)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <CardBack />
      </div>
    </>
  );
};

export default FlippableCard;
