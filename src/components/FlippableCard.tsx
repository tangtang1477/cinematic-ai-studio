import CardBack from "./CardBack";

interface FlippableCardProps {
  front: React.ReactNode;
}

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
          transformStyle: "flat",
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
          transformStyle: "flat",
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
