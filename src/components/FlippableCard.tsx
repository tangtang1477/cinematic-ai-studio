import CardBack from "./CardBack";

interface FlippableCardProps {
  front: React.ReactNode;
}

/**
 * A card with two faces using CSS 3D transforms.
 * The PARENT applies the cardFlip animation (rotateY + scale) to this element.
 * This component only sets up backface-visibility for front/back.
 */
const FlippableCard = ({ front }: FlippableCardProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
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
          transform: "rotateY(0deg)",
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
        }}
      >
        <CardBack />
      </div>
    </div>
  );
};

export default FlippableCard;
